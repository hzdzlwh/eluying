<template>
    <div>
        <DateSelect/>
        <h2 class="title">{{$route.meta.name}}</h2>
        <div class="top">
            <div class="date">日期 : <i>{{date.startDate}} ~ {{date.endDate}}</i></div>
            <div class="select-box">
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="type" >
                        <dd-option :key="item.id" v-for="item in typeAll" :value="item.type" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="categoryType" >
                        <dd-option :key="item.id" v-for="item in categoryTypeAll" :value="item.categoryType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr room" >
                    <dd-select v-model="channelType" >
                        <dd-option :key="item.id" v-for="item in channelTypeAll" :value="item.channelType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
            </div>
            <div class="export">
                <dd-dropdown text="导出明细" trigger="click" style="width:100px;">
                  <!-- <dd-dropdown-item><span><a :href="exportUrl(1)">导出PDF</a></span></dd-dropdown-item> -->
                  <dd-dropdown-item><span><a :href="exportUrl(0)">导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    
</style>