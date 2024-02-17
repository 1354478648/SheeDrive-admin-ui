<script setup>

</script>

<template>
    <div class="footer">
        <el-text class="text">
            Copyright © 2024 TangSheng. All rights Reserved. | Related links:&nbsp;
            <el-link href="https://github.com/1354478648" type="primary">TangSheng's GitHub</el-link>
            &nbsp;
            <el-link href="https://tangricheng.com/" type="primary">TangSheng's Blog</el-link>
        </el-text>
    </div>
</template>

<style lang="scss" scoped>
.footer {
    position: absolute;
    bottom: 5px;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0);
    text-align: center;
    align-items: center;

    .text {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
}
</style>