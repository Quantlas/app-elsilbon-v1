<script setup></script>
<template>
    <footer>
        <div class="footer">
            <div class="row">
                <a href="https://www.facebook.com/people/El-Silb%C3%B3n-Agencia-Informativa/61563935896930/" target="_blank"><i class="pi pi-facebook"></i></a>
                <a href="https://www.instagram.com/ElSilbonAI/" target="_blank"><i class="pi pi-instagram"></i></a>
                <a href="https://www.youtube.com/@elsilbonagenciainformativa" target="_blank"><i class="pi pi-youtube"></i></a>
                <a href="https://x.com/ElSilbonAI" target="_blank"><i class="pi pi-twitter"></i></a>
            </div>

            <!-- <div class="row">
                <ul>
                    <li><a href="#">Contact us</a></li>
                    <li><a href="#">Our Services</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms & Conditions</a></li>
                    <li><a href="#">Career</a></li>
                </ul>
            </div> -->

            <div class="row">
                El Silbon Copyright © 2024 - All rights reserved <br />
                Powered by <a href="https://quantlas.tech" target="_blank">Quantlas</a>
            </div>
        </div>
    </footer>
</template>
<style>
.footer {
    background: #ccc;
    padding: 30px 0px;
    font-family: 'Play', sans-serif;
    text-align: center;
}

.footer .row {
    width: 100%;
    margin: 1% 0%;
    padding: 0.6% 0%;
    color: gray;
    font-size: 0.8em;
    text-align: center;
}

.footer .row a {
    text-decoration: none;
    color: gray;
    transition: 0.5s;
}

.footer .row a:hover {
    color: #fff;
}

.footer .row ul {
    width: 100%;
}

.footer .row ul li {
    display: inline-block;
    margin: 0px 30px;
}

.footer .row a i {
    font-size: 2em;
    margin: 0% 1%;
}

@media (max-width: 720px) {
    .footer {
        text-align: left;
        padding: 5%;
    }
    .footer .row ul li {
        display: block;
        margin: 10px 0px;
        text-align: left;
    }
    .footer .row a i {
        margin: 0% 3%;
    }
}
</style>
