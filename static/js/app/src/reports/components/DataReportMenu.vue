<template>
    <ul class='report-top-menu'>
        <li v-if="!route.meta.invisible" v-for="route in $router.options.routes" class="topMenu-item">
            <router-link :to="route.path">{{route.meta.name}}</router-link>
        </li>
    </ul>
</template>
<style lang="scss" scoped>
    .report-top-menu{
      position:fixed;
      width:100%;
      height:50px;
      z-index:1500;
      background:#fbfbfb;
      display:flex;
      justify-content:center;
      align-items:center;  
      border-bottom:1px solid #ccc;
      box-shadow:0px 1px 3px #dadada;
      .topMenu-item{
        height:100%;
      }
        a {
          box-sizing:border-box;
          height:100%;
          font-size: 14px;
          color: #999;
          padding:0 10px;
          text-decoration: none;
          display: inline-block;
          text-align: center;
          line-height:50px;
          cursor: pointer;
        }
        a.active {
          color: #178CE6;
          border-bottom: #178CE6 solid medium;
        }
        a:hover {
          color: #178CE6;
        }
    }
</style>
<script>
    export default{
    };
</script>