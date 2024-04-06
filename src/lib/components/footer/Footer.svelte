<footer>
    Footer
</footer>

<style>
    footer {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #444422;
        width: 100%;
        height: 200px;
    }
    footer::after {
        content: "hello";
        position: fixed;
        top: 70vh;
        background: #444422;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -100;
    }
</style>