import { Ownable } from './lib/Ownable.algo';

export class Farm extends Ownable {
  poolId = GlobalStateKey<AppID>({ key: 'pool_id' });
  numberOfCycles = GlobalStateKey<uint64>({ key: 'number_of_cycles' });
  programStarts = GlobalStateKey<uint64>({ key: 'program_starts' });
  durationOfCycle = GlobalStateKey<uint64>({ key: 'duration_of_cycle' });
  rewardAmountPerCycle = GlobalStateKey<uint256>({ key: 'reward_per_cycle' });
  entriesCounter = GlobalStateKey<uint64>({ key: 'entries_counter' });

  NomedexFarmEnter = new EventLogger<{ id: uint64, owner: Address; amount: uint256, cycle: uint64, total: uint256 }>();
  NomedexFarmClaim = new EventLogger<{ id: uint64, owner: Address; amount: uint256, cycle: uint64 }>();
  NomedexFarmLeave = new EventLogger<{ id: uint64, owner: Address; amount: uint256, total: uint256 }>();

  cycleTotals = BoxMap<uint64, uint256>();

  entries = BoxMap<uint64, {
    owner: Address,
    amount: uint256,
    cycle: uint64,
  }>();

  private getNextCycle(): uint64 {
    if (globals.round < this.programStarts.value) return 0;
    return ((globals.round - this.programStarts.value) / this.durationOfCycle.value) + 1;
  }

  private getCycleCounts(fromCycle: uint64): uint64 {
    const next = this.getNextCycle();
    if (next <= 1) return 0;
    let pendingCycle = next - 1;
    if (pendingCycle > this.numberOfCycles.value) {
      pendingCycle = this.numberOfCycles.value;
    }
    return pendingCycle - fromCycle;
  }

  private getCycleTotal(cycle: uint64): uint256 {
    if (cycle >= this.numberOfCycles.value) return <uint256>0;
    if (this.cycleTotals(cycle).exists) {
      return this.cycleTotals(cycle).value;
    } else if (cycle === 0) {
      return <uint256>0;
    } else {
      return this.getCycleTotal(cycle - 1);
    }
  }

  private setCycleTotal(cycle: uint64, total: uint256): uint256 {
    if (cycle >= this.numberOfCycles.value) return <uint256>0;
    this.cycleTotals(cycle).value = total;
    return total;
  }

  enter(amount: uint256) {
    const id = this.entriesCounter.value;
    assert(!this.entries(id).exists, "entry with same id already exists");

    const nextCycle = this.getNextCycle();
    assert(nextCycle < this.numberOfCycles.value, "program ended");

    this.entries(id).value = {
      owner: this.txn.sender,
      amount: amount,
      cycle: nextCycle
    };

    const totalLocked = this.setCycleTotal(nextCycle, this.getCycleTotal(nextCycle) + amount);

    this.NomedexFarmEnter.log({
      id: id,
      owner: this.txn.sender,
      amount: amount,
      cycle: nextCycle,
      total: totalLocked,
    });

    this.entriesCounter.value = id + 1;
  }

  claim(id: uint64): boolean {
    assert(this.entries(id).exists, "entry with id not found");
    const entry = this.entries(id).value;
    assert(entry.owner == this.txn.sender, "unauthorized");

    const cycles = this.getCycleCounts(entry.cycle);
    assert(cycles > 0, "cycles must be > 0");

    let rewardAmount = <uint256>0;
    for (let i = 0; i < cycles; i = i + 1) {
      // <uint256>(<uint256>cycles * this.rewardAmountPerCycle.value);
    }
    assert(rewardAmount > <uint256>0, "claim must be > 0");

    this.entries(id).value = {
      owner: entry.owner,
      amount: entry.amount,
      cycle: entry.cycle + cycles
    };

    return true;
  }

  leave(id: uint64) {
    assert(this.entries(id).exists, "entry with id not found");
    const entry = this.entries(id).value;
    assert(entry.owner == this.txn.sender, "unauthorized");

    this.claim(id);
    sendPayment({
      amount: <uint64>entry.amount,
      sender: this.app.address,
      receiver: this.txn.sender,
      fee: globals.minTxnFee,
    });

    const nextCycle = this.getNextCycle();
    let totalLocked = this.getCycleTotal(nextCycle);

    if (nextCycle < this.numberOfCycles.value) {
      totalLocked = this.setCycleTotal(nextCycle, totalLocked - entry.amount);
    }

    if (nextCycle > 0 && nextCycle <= this.numberOfCycles.value) {
      const pendingCycle = nextCycle - 1;
      this.setCycleTotal(pendingCycle, this.getCycleTotal(pendingCycle) - entry.amount);
    }

    this.NomedexFarmLeave.log({
      id: id,
      owner: entry.owner,
      amount: entry.amount,
      total: totalLocked,
    });

    this.entries(id).delete();
  }
}
