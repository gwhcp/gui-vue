<template>
    <footer class="pt-5 d-flex justify-content-between">
        <span>
            &copy; {{ new Date().getFullYear() }} <a href="https://gwhcp.dev"
                                                     target="_blank">GWHCP</a>
        </span>

        <ul class="nav m-0 d-print-none">
            <li class="nav-item">
                <a aria-current="page"
                   class="nav-link text-secondary"
                   href="#"> Privacy Policy </a>
            </li>

            <li class="nav-item">
                <a class="nav-link text-secondary"
                   href="#">Terms and conditions</a>
            </li>

            <li class="nav-item">
                <a class="nav-link text-secondary"
                   href="#">Contact</a>
            </li>
        </ul>
    </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "TheFooter"
});
</script>