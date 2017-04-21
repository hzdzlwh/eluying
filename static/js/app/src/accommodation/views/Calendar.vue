<template>
    <div>
        <Search @showOrder="showOrderDetail" />
        <Calendar
                @dateChange="handleDateChange"
                @roomFilterChange="handleRoomFilter"
                @fold="handleFold"
                @showOrder="showOrderDetail"
                :categories="categories"
                :holidays="holidays"
                :roomStatus="roomStatus"
                :defaultStartDate="startDateStr"
                :orderList="orderList"
                :startDate="startDate"
                :dateRange="dateRange"
                :leftMap="leftMap"
                :DAYS="DAYS"
        />
        <ShopCart
                :selectedEntries="selectedEntries"
                @changeCheckState="changeCheckState"
        />
    </div>
</template>
<style>

</style>
<script>
export default {

};
</script>
