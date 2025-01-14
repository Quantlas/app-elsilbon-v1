<script setup>
import { ref } from 'vue';

const items = ref([
    { route: '/dashboard', label: 'Dashboard', icon: 'pi pi-home' },
    { route: '/transactions', label: 'Transactions', icon: 'pi pi-chart-line' },
    { route: '/products', label: 'Products', icon: 'pi pi-list' },
    { route: '/messages', label: 'Messages', icon: 'pi pi-inbox' }
]);
</script>

<template>
    <div class="card bg-gray-100 m-2">
        <h1>Sucesos</h1>
        <Card style="max-width: 100%; overflow: hidden" class="m-4">
            <template #header>
                <Image alt="user header" src="demo/images/galleria/galleria2.jpg" imageStyle="width: 100%; border-radius: 10px; max-height: 100%; padding:1%" />
            </template>
            <template #title>Este es el titulo de la noticia que puede ser mas largo de lo normal</template>
            <template #subtitle>Por aqui va el subtitulo</template>
            <template #content>
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                    quas!...
                </p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <a href="#">
                        <Button label="Leer" severity="secondary" outlined class="w-full" />
                    </a>
                    <a href="#">
                        <Button label="Compartir" class="w-full" />
                    </a>
                </div>
            </template>
        </Card>
        <a href="#">
            <Button label="Ver más" severity="secondary" outlined class="w-full bg-white" style="color: black" />
        </a>
    </div>
    <div class="card bg-gray-100 m-2">
        <h1>Tecnologías</h1>
        <Card style="max-width: 100%; overflow: hidden" class="m-4">
            <template #header>
                <Image alt="user header" src="demo/images/galleria/galleria2.jpg" imageStyle="width: 100%; border-radius: 10px; max-height: 100%; padding:1%" />
            </template>
            <template #title>Este es el titulo de la noticia que puede ser mas largo de lo normal</template>
            <template #subtitle>Por aqui va el subtitulo</template>
            <template #content>
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                    quas!...
                </p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <a href="#">
                        <Button label="Leer" severity="secondary" outlined class="w-full" />
                    </a>
                    <a href="#">
                        <Button label="Compartir" class="w-full" />
                    </a>
                </div>
            </template>
        </Card>
        <Card style="max-width: 100%; overflow: hidden" class="m-4">
            <template #header>
                <Image alt="user header" src="demo/images/galleria/galleria3.jpg" imageStyle="width: 100%; border-radius: 10px; max-height: 100%; padding:1%" />
            </template>
            <template #title>Este es el titulo de la noticia que puede ser mas largo de lo normal</template>
            <template #subtitle>Por aqui va el subtitulo</template>
            <template #content>
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                    quas!...
                </p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <a href="#">
                        <Button label="Leer" severity="secondary" outlined class="w-full" />
                    </a>
                    <a href="#">
                        <Button label="Compartir" class="w-full" />
                    </a>
                </div>
            </template>
        </Card>
        <a href="#">
            <Button label="Ver más" severity="secondary" outlined class="w-full bg-white" style="color: black" />
        </a>
    </div>
    <div class="card bg-gray-100 m-2">
        <h1>Deportes</h1>
        <Card style="max-width: 100%; overflow: hidden" class="m-4">
            <template #header>
                <Image alt="user header" src="demo/images/galleria/galleria2.jpg" imageStyle="width: 100%; border-radius: 10px; max-height: 100%; padding:1%" />
            </template>
            <template #title>Este es el titulo de la noticia que puede ser mas largo de lo normal</template>
            <template #subtitle>Por aqui va el subtitulo</template>
            <template #content>
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                    quas!...
                </p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <a href="#">
                        <Button label="Leer" severity="secondary" outlined class="w-full" />
                    </a>
                    <a href="#">
                        <Button label="Compartir" class="w-full" />
                    </a>
                </div>
            </template>
        </Card>
        <Card style="max-width: 100%; overflow: hidden" class="m-4">
            <template #header>
                <Image alt="user header" src="demo/images/galleria/galleria3.jpg" imageStyle="width: 100%; border-radius: 10px; max-height: 100%; padding:1%" />
            </template>
            <template #title>Este es el titulo de la noticia que puede ser mas largo de lo normal</template>
            <template #subtitle>Por aqui va el subtitulo</template>
            <template #content>
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                    quas!...
                </p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <a href="#">
                        <Button label="Leer" severity="secondary" outlined class="w-full" />
                    </a>
                    <a href="#">
                        <Button label="Compartir" class="w-full" />
                    </a>
                </div>
            </template>
        </Card>
        <a href="#">
            <Button label="Ver más" severity="secondary" outlined class="w-full bg-white" style="color: black" />
        </a>
    </div>
    <div class="card bg-gray-100 m-2">
        <h1>Arte y Cultura</h1>
        <Card style="max-width: 100%; overflow: hidden" class="m-4">
            <template #header>
                <Image alt="user header" src="demo/images/galleria/galleria10.jpg" imageStyle="width: 100%; border-radius: 10px; max-height: 100%; padding:1%" />
            </template>
            <template #title>Este es el titulo de la noticia que puede ser mas largo de lo normal</template>
            <template #subtitle>Por aqui va el subtitulo</template>
            <template #content>
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                    quas!...
                </p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <a href="#">
                        <Button label="Leer" severity="secondary" outlined class="w-full" />
                    </a>
                    <a href="#">
                        <Button label="Compartir" class="w-full" />
                    </a>
                </div>
            </template>
        </Card>
        <Card style="max-width: 100%; overflow: hidden" class="m-4">
            <template #header>
                <Image alt="user header" src="demo/images/galleria/galleria5.jpg" imageStyle="width: 100%; border-radius: 10px; max-height: 100%; padding:1%" />
            </template>
            <template #title>Este es el titulo de la noticia que puede ser mas largo de lo normal</template>
            <template #subtitle>Por aqui va el subtitulo</template>
            <template #content>
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                    quas!...
                </p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <a href="#">
                        <Button label="Leer" severity="secondary" outlined class="w-full" />
                    </a>
                    <a href="#">
                        <Button label="Compartir" class="w-full" />
                    </a>
                </div>
            </template>
        </Card>
        <a href="#">
            <Button label="Ver más" severity="secondary" outlined class="w-full bg-white" style="color: black" />
        </a>
    </div>
</template>
