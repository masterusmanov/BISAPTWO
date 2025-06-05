<template>
    <div class="bg-white min-h-screen w-full ">
        <ModeratorHeader/>
        <div class="">
            <h2 class="p-4 font-[700]">{{$t('moderators')}}</h2>
            <div class="px-4">
                <TableModerator/>
            </div>
        </div>
    </div>
</template>

<script setup>
    import TableModerator from "../../components/TableRole/TableModerator.vue";
import ModeratorHeader from "../../components/ModeratorHeader/index.vue"
</script>

<style lang="scss" scoped>

</style>