<script setup></script>
<template>
    <div class="relative isolate overflow-hidden bg-gray-900 h-full" style="height: 300px">
        <div class="mx-auto max-w-7xl p-4">
            <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                <div class="max-w-xl lg:max-w-lg">
                    <h2 class="text-3xl font-bold tracking-tight text-white mt-4 sm:text-4xl">Suscribase a nuestro newsletter.</h2>
                    <p class="mt-4 text-lg leading-8 text-gray-300">
                        ¿Quieres estar al día con las últimas noticias y tendencias? Suscríbete a nuestro newsletter y recibe en tu bandeja de entrada los artículos más interesantes, análisis exclusivos y actualizaciones sobre lo que realmente
                        importa. ¡No te pierdas nada y únete a nuestra comunidad informativa!
                    </p>
                    <div class="mt-6 flex max-w-md gap-x-4">
                        <InputText
                            id="email-address"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required=""
                            class="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            placeholder="Ingrese su email"
                        />
                        <Button
                            type="submit"
                            class="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                            Suscribir
                        </Button>
                    </div>
                </div>
                <dl class="grid grid-cols-1 gap-x-8 gap-y-10 mt-4 sm:grid-cols-2 lg:pt-2">
                    <div class="flex flex-col items-start">
                        <div class="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                            <i class="pi pi-calendar"></i>
                        </div>
                        <dt class="mt-4 font-semibold text-white">Articulos semanales</dt>
                        <dd class="mt-2 leading-7 text-gray-400">Recibe cada semana un resumen conciso con los temas más relevantes.</dd>
                    </div>
                    <div class="flex flex-col items-start">
                        <div class="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                            <i class="pi pi-hand"></i>
                        </div>
                        <dt class="mt-4 font-semibold text-white">Sin spam</dt>
                        <dd class="mt-2 leading-7 text-gray-400">Tu privacidad es importante para nosotros. ¡Suscríbete con confianza!</dd>
                    </div>
                </dl>
            </div>
        </div>
        <div class="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
            <div
                class="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
            />
        </div>
    </div>
</template>
