<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'

const direction = ref('multimodal scientific document understanding')

const recommendations = [
  {
    id: 'rec-1',
    title: 'Scientific Document VLMs for Reading Assistance',
    venue: 'arXiv',
    year: 2025,
    relation: 'Trending',
    reason: '和你当前的“多模态论文理解”方向高度接近，可作为入门综述入口。',
  },
  {
    id: 'rec-2',
    title: 'Citation-aware Retrieval for Research Exploration',
    venue: 'SIGIR',
    year: 2024,
    relation: 'Upstream',
    reason: '适合作为文献追踪与上下游检索能力的技术参考。',
  },
  {
    id: 'rec-3',
    title: 'Interactive Knowledge Graphs for Scholarly Search',
    venue: 'CHI',
    year: 2024,
    relation: 'Downstream',
    reason: '和知识图谱可视化及科研探索交互关系较强。',
  },
]
</script>

<template>
  <section class="discover-page">
    <header class="discover-header">
      <div>
        <h1 class="section-title">Discover</h1>
        <p class="section-description">研究方向推荐、上下游文献检索和 arXiv 接入入口可以统一放在这里。</p>
      </div>

      <label class="discover-search">
        <el-icon><Search /></el-icon>
        <input v-model="direction" type="text" placeholder="Enter research direction..." />
      </label>
    </header>

    <section class="discover-list">
      <article v-for="item in recommendations" :key="item.id" class="discover-item">
        <div class="discover-item__main">
          <div class="discover-item__meta">
            <span
              class="status-pill"
              :class="item.relation === 'Trending' ? 'is-brand' : item.relation === 'Upstream' ? 'is-warning' : 'is-success'"
            >
              {{ item.relation }}
            </span>
            <small>{{ item.venue }} · {{ item.year }}</small>
          </div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.reason }}</p>
        </div>
        <el-button plain>View Details</el-button>
      </article>
    </section>
  </section>
</template>

<style scoped>
.discover-page {
  display: grid;
  gap: 0.9rem;
}

.discover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--line-soft);
}

.discover-search {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-width: min(420px, 100%);
  padding: 0.56rem 0.8rem;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background: white;
  font-size: 0.88rem;
}

.discover-search input {
  width: 100%;
  border: 0;
  background: transparent;
  outline: none;
}

.discover-list {
  display: grid;
  gap: 1rem;
  padding-top: 1rem;
}

.discover-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.8rem;
  border-top: 1px solid var(--line-soft);
}

.discover-item:first-child {
  padding-top: 0;
  border-top: 0;
}

.discover-item__meta {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.discover-item__meta small,
.discover-item p {
  color: var(--text-secondary);
}

.discover-item h2 {
  margin: 0.5rem 0 0.35rem;
  font-size: 1.02rem;
}

@media (max-width: 820px) {
  .discover-header,
  .discover-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .discover-search {
    width: 100%;
    min-width: 0;
  }
}
</style>
