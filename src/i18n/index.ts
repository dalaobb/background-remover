export type Lang = 'en' | 'zh';

export const LANG_STORAGE_KEY = 'bgg-lang';

export const translations = {
  en: {
    click: 'Click',
    dragDrop: 'Drag & Drop',
    pasteImage: 'Paste Image (Ctrl+V/Cmd+V)',
    startRemoving: 'Start Removing Backgrounds',
    tryExamples: 'No image? Try one of these:',
    noticeLightModel: "Notice: You're using a lightweight model.",
    selected: 'Selected:',
    outputFormat: 'Output format:',
    loading: 'Loading...',
    removing: 'Removing...',
    start: 'Start',
    clear: 'Clear',
    oomWarning:
      '⚠️ Your device may struggle with this task. Try using a desktop for better results.',
    trySmallerModel: 'Try a smaller model?',
    done: '🎉 Done! Time taken: {time}',
    download: 'Download',
    downloadAllZip: 'Download All as ZIP',
    failedPackage: 'Failed to package images.',
    after: 'After:',
    preview: 'Preview',
    copied: '✅ Copied!',
    copy: 'Copy',
    save: 'Save',
    processing: 'Processing...',
  },
  zh: {
    click: '点击上传',
    dragDrop: '拖拽上传',
    pasteImage: '粘贴图片 (Ctrl+V)',
    startRemoving: '开始去除背景',
    tryExamples: '没有图片？试试这些示例：',
    noticeLightModel: '提示：你正在使用轻量级模型。',
    selected: '已选择：',
    outputFormat: '输出格式：',
    loading: '加载中...',
    removing: '处理中...',
    start: '开始',
    clear: '清空',
    oomWarning: '⚠️ 您的设备可能难以完成此任务，建议在电脑上使用以获得更好的效果。',
    trySmallerModel: '尝试更小的模型？',
    done: '🎉 完成！耗时：{time}',
    download: '下载',
    downloadAllZip: '打包下载 (ZIP)',
    failedPackage: '图片打包失败。',
    after: '处理后：',
    preview: '预览',
    copied: '✅ 已复制！',
    copy: '复制',
    save: '保存',
    processing: '处理中...',
  },
} as const;

export type TKey = keyof typeof translations['en'];

export function t(lang: Lang, key: TKey, vars?: Record<string, string>): string {
  let s = translations[lang][key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(`{${k}}`, v);
    }
  }
  return s;
}
