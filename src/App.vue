<template>
  <div class="app-container">
    <header class="header">
      <h1 class="title animate__animated animate__fadeInDown">
        微信公众号文章排版工具
      </h1>
    </header>
    <main class="main-content animate__animated animate__fadeIn">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
  background-color: var(--background-color);
  padding: 20px;
}

.header {
  text-align: center;
  padding: 20px 0;
  margin-bottom: 30px;
  
  .title {
    font-size: 2.5rem;
    color: var(--primary-color);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }
}

.main-content {
  max-width: 1440px;
  margin: 0 auto;
}
</style> 