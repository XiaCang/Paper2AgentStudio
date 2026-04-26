<script setup lang="ts">
import { EditPen, FolderOpened, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'

import type { LibraryPaper, PaperKeyPoints } from '../../api/library'
import { saveKeyPointsApi } from '../../api/library'
import LibraryFolder from './LibraryFolder.vue'
import PaperDetail from './paper/PaperDetail.vue'

interface LibraryFolder {
  id: string
  name: string
  paperIds: string[]
  children?: LibraryFolder[]
}

const searchQuery = ref('')
const selectedPaperId = ref('paper-4')
const folderPanelVisible = ref(true)
const selectedFolderId = ref<string>('all')
const editingFolderId = ref<string | null>(null)
const editingFolderName = ref('')
const expandedFolders = ref<Set<string>>(new Set())
const paperDetailVisible = ref(false)
const selectedPaper = ref<LibraryPaper | null>(null)

const folders = ref<LibraryFolder[]>([
  {
    id: 'folder-1',
    name: '深度学习',
    paperIds: ['paper-1', 'paper-2'],
    children: [
      {
        id: 'folder-1-1',
        name: 'Transformer',
        paperIds: ['paper-1'],
        children: [
          {
            id: 'folder-1-1-1',
            name: 'Attention机制',
            paperIds: [],
            children: [
              {
                id: 'folder-1-1-1-1',
                name: 'Self-Attention',
                paperIds: [],
                children: [
                  {
                    id: 'folder-1-1-1-1-1',
                    name: 'Multi-Head Attention',
                    paperIds: [],
                  }
                ]
              }
            ]
          },
          {
            id: 'folder-1-1-2',
            name: 'Positional Encoding',
            paperIds: [],
          }
        ]
      },
      {
        id: 'folder-1-2',
        name: 'CNN',
        paperIds: ['paper-2'],
      },
    ],
  },
  {
    id: 'folder-2',
    name: '计算机视觉',
    paperIds: ['paper-1', 'paper-3', 'paper-5'],
    children: [
      {
        id: 'folder-2-1',
        name: '目标检测',
        paperIds: ['paper-3'],
      },
    ],
  },
  {
    id: 'folder-3',
    name: '自然语言处理',
    paperIds: ['paper-2', 'paper-4'],
  },
])

const papers = ref<LibraryPaper[]>([
  {
    id: 'paper-1',
    title: 'Transformers in Vision',
    authors: 'A. Calianham',
    year: 2022,
    status: 'Processing',
    source: 'CVPR',
    keyPoints: {
      background: '视觉任务中传统CNN的局限性，需要更好的长距离依赖建模',
      method: '将图像分割为visual tokens，使用Transformer编码器处理',
      innovation: '首次将纯Transformer架构应用于计算机视觉任务',
      conclusion: 'ViT在大规模数据集上可以达到甚至超越SOTA CNN的性能'
    },
  },
  {
    id: 'paper-2',
    title: 'Transformers in Poraios and Grapheni Methods',
    authors: 'R. K. Rainur',
    year: 2023,
    status: 'Completed',
    source: 'arXiv',
    keyPoints: {
      background: '多模态数据对齐和检索存在语义鸿沟问题',
      method: '采用跨模态对齐技术和混合检索策略',
      innovation: '提出新颖的跨模态表示学习方法',
      conclusion: '显著提升了跨模态检索的准确性和效率'
    },
  },
  {
    id: 'paper-3',
    title: 'Transformers in Vision',
    authors: 'R. S. Soft',
    year: 2023,
    status: 'Completed',
    source: 'NeurIPS',
    keyPoints: {
      background: '域适应和零样本迁移在实际应用中面临挑战',
      method: '利用领域自适应技术和零样本学习框架',
      innovation: '设计了新的域不变特征提取器',
      conclusion: '在多个基准测试中实现了优异的零样本迁移性能'
    },
  },
  {
    id: 'paper-4',
    title: 'Transformers in Vision',
    authors: 'R. C. Bamer, R.A',
    year: 2022,
    status: 'Awaiting Review',
    source: 'ICLR',
    keyPoints: {
      background: '传统序列模型的训练效率和并行化能力不足',
      method: '引入自注意力机制实现并行处理',
      innovation: 'Attention机制大幅减少训练时间并提升模型表现',
      conclusion: 'Transformer成为NLP和CV领域的基础架构'
    },
  },
  {
    id: 'paper-5',
    title: 'Transformens and Meal Designers in Vision',
    authors: 'A. Steruan R. Maris',
    year: 2023,
    status: 'Completed',
    source: 'ECCV',
    keyPoints: {
      background: '视觉模型训练需要大量数据和计算资源',
      method: '优化数据集效率和训练配方设计',
      innovation: '提出更高效的训练策略和数据增强方法',
      conclusion: '在减少资源消耗的同时保持了模型性能'
    },
  },
])

const filteredPapers = computed(() => {
  let result = papers.value
  
  // 根据文件夹筛选
  if (selectedFolderId.value !== 'all') {
    const folder = folders.value.find(f => f.id === selectedFolderId.value)
    if (folder) {
      result = result.filter(paper => folder.paperIds.includes(paper.id))
    }
  }
  
  // 根据搜索关键词筛选
  const keyword = searchQuery.value.trim().toLowerCase()
  if (!keyword) {
    return result
  }

  return result.filter((paper) => paper.title.toLowerCase().includes(keyword))
})

const handleReview = (paper: LibraryPaper) => {
  selectedPaper.value = paper
  selectedPaperId.value = paper.id
  // 不再需要初始化draftKeyPoints，由PaperDetail组件内部管理
  paperDetailVisible.value = true
}

// 保存关键点（从抽屉组件触发）
const handleSaveKeyPoints = async (paperId: string, keyPoints: PaperKeyPoints) => {
  try {
    await saveKeyPointsApi(paperId, keyPoints)
    
    // 更新本地数据
    const paper = papers.value.find((item) => item.id === paperId)
    if (paper) {
      paper.keyPoints = keyPoints
      paper.status = 'Completed'
    }
    
    ElMessage.success('关键点已保存到服务器')
  } catch (error) {
    ElMessage.error('保存失败，请重试')
    console.error('保存关键点失败:', error)
  }
}

// 预览 PDF
const handlePreviewPdf = (paperId: string) => {
  ElMessage.info(`预览论文 PDF: ${paperId}`)
  // TODO: 实现 PDF 预览功能，可以打开新窗口或嵌入 PDF 查看器
  // 例如：window.open(`/papers/${paperId}/pdf`, '_blank')
}

const handleSave = () => {
  // 此方法已被PaperDetail组件中的handleSaveKeyPoints替代
  ElMessage.info('请使用论文详情抽屉中的保存功能')
}

const statusClassMap: Record<LibraryPaper['status'], string> = {
  Processing: 'is-warning',
  Completed: 'is-success',
  'Awaiting Review': 'is-brand',
}
</script>

<template>
  <section class="library-page">
    <!-- 文件夹抽屉组件 -->
    <LibraryFolder
      v-model:selected-folder-id="selectedFolderId"
      v-model:expanded-folders="expandedFolders"
      v-model:folder-panel-visible="folderPanelVisible"
      :folders="folders"
    />

    <!-- 论文详情抽屉 -->
    <PaperDetail
      v-model="paperDetailVisible"
      :paper="selectedPaper"
      @save="handleSaveKeyPoints"
      @preview-pdf="handlePreviewPdf"
    />

    <!-- 主内容区 -->
    <div class="library-main">
      <!-- 顶部工具栏 -->
      <header class="library-header">
        <div class="library-header__left">
          <span v-if="selectedFolderId !== 'all'" class="current-folder">
            当前文件夹：{{ folders.find(f => f.id === selectedFolderId)?.name || '全部' }}
          </span>
          <span v-else class="current-folder">全部论文</span>
        </div>

        <label class="library-search">
          <el-icon><Search /></el-icon>
          <input v-model="searchQuery" type="text" placeholder="Search by title..." />
        </label>
      </header>

      <section class="library-table">
        <el-table :data="filteredPapers" row-key="id">
          <el-table-column prop="title" label="Title" min-width="300" />
          <el-table-column prop="authors" label="Authors" min-width="180" />
          <el-table-column prop="year" label="Year" width="100" />
          <el-table-column label="Status" width="170">
            <template #default="{ row }">
              <span class="status-pill" :class="statusClassMap[row.status as LibraryPaper['status']]">
                {{ row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Action" width="200">
            <template #default="{ row }">
              <el-button text @click="handleReview(row)">
                <el-icon><EditPen /></el-icon>
                Review Key Points 
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>

      <!-- 移除旧的Key Points Review区域，因为现在使用PaperDetail抽屉 -->
    </div>
  </section>
</template>

<style scoped>
.library-page {
  display: flex;
  gap: 0;
  min-height: calc(100vh - 60px);
  position: relative;
}

/* 主内容区 */
.library-main {
  flex: 1;
  display: grid;
  gap: 0.9rem;
  padding: 1.2rem 1.5rem 1.5rem;
  min-width: 0;
}

.library-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--line-soft);
}

.library-header__left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-folder {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.library-search {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-width: min(340px, 100%);
  padding: 0.56rem 0.8rem;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background: white;
  color: var(--text-secondary);
  font-size: 0.88rem;
}

.library-search input {
  width: 100%;
  border: 0;
  background: transparent;
  outline: none;
}

.library-table {
  padding: 0.8rem 0 1rem;
  border-bottom: 1px solid var(--line-soft);
}

@media (max-width: 820px) {
  .library-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .library-header__left {
    width: 100%;
    flex-wrap: wrap;
  }

  .library-search {
    width: 100%;
    min-width: 0;
  }
}
</style>
