<template>
    <div class="bg-white min-h-screen w-full ">
        <MinOrganHeader/>
        <div class="">
            <h2 class="p-4 font-[700]">{{$t('minorgan')}}</h2>
            <div class="px-4">
                <TableMinOrgan/>
            </div>
        </div>
    </div>
</template>

<script setup>
    import MinOrganHeader from "../../components/MinOrganComponent/MinOrganHeader.vue"
    import TableMinOrgan from "../../components/TableMinOrgan/TableMInOrgan.vue";
</script>

<style lang="scss" scoped>

</style>