// 创建预加载管理器
const PreloadManager = {
    cache: new Map(),
    
    // 预加载单个资源
    preload(src) {
        if (this.cache.has(src)) {
            return Promise.resolve(this.cache.get(src));
        }

        return new Promise((resolve, reject) => {
            const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');
            
            if (isVideo) {
                const video = document.createElement('video');
                video.src = src;
                video.preload = 'auto';
                
                video.onloadeddata = () => {
                    this.cache.set(src, video);
                    resolve(video);
                };
                
                video.onerror = () => {
                    reject(new Error(`Failed to load video: ${src}`));
                };
            } else {
                const img = new Image();
                img.src = src;
                
                img.onload = () => {
                    this.cache.set(src, img);
                    resolve(img);
                };
                
                img.onerror = () => {
                    reject(new Error(`Failed to load image: ${src}`));
                };
            }
        });
    },
    
    // 预加载资源数组
    preloadAll(sources) {
        return Promise.allSettled(sources.map(src => this.preload(src)));
    },
    
    // 获取缓存的资源
    get(src) {
        return this.cache.get(src);
    },
    
    // 检查资源是否已缓存
    isCached(src) {
        return this.cache.has(src);
    }
};

// 显示预览
function showPreview(src, isVideo = false) {
    // 移除可能存在的旧预览和事件监听器
    const existingOverlay = document.querySelector('.preview-overlay');
    if (existingOverlay) {
        document.removeEventListener('keydown', existingOverlay.escHandler);
        document.removeEventListener('keydown', existingOverlay.keyNavHandler);
        existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.className = 'preview-overlay loading';
    
    const loader = document.createElement('div');
    loader.className = 'preview-loader';
    overlay.appendChild(loader);
    
    // 创建新的内容元素
    const content = isVideo ? document.createElement('video') : document.createElement('img');
    content.className = 'preview-content';
    
    if (isVideo) {
        content.controls = true;
        content.autoplay = false;
    }

    // 清理函数
    const cleanup = () => {
        document.removeEventListener('keydown', overlay.escHandler);
        document.removeEventListener('keydown', overlay.keyNavHandler);
        overlay.remove();
    };

    // 关闭预览
    const closePreview = () => {
        overlay.classList.remove('active');
        setTimeout(cleanup, 300);
    };

    // 加载处理
    const loadHandler = () => {
        overlay.classList.remove('loading');
        overlay.classList.add('active');
    };

    content.onload = loadHandler;
    content.onloadeddata = loadHandler;

    // 错误处理
    content.onerror = () => {
        overlay.innerHTML = `
            <div style="color: white; text-align: center;">
                加载失败，请重试<br>
                <small style="opacity: 0.7;">Failed to load: ${src}</small>
            </div>
        `;
        setTimeout(cleanup, 2000);
    };

    // 点击遮罩层关闭
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closePreview();
        }
    };

    // ESC键关闭
    overlay.escHandler = (e) => {
        if (e.key === 'Escape') {
            closePreview();
        }
    };

    // 左右键导航
    overlay.keyNavHandler = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const direction = e.key === 'ArrowLeft' ? -1 : 1;
            const currentIndex = archProjectImages.indexOf(src);
            const newIndex = (currentIndex + direction + archProjectImages.length) % archProjectImages.length;
            closePreview();
            setTimeout(() => {
                showProjectImages(newIndex, archProjectImages);
            }, 300);
        }
    };

    // 添加事件监听
    document.addEventListener('keydown', overlay.escHandler);
    document.addEventListener('keydown', overlay.keyNavHandler);

    // 设置内容源并添加到页面
    content.src = src;
    overlay.appendChild(content);
    document.body.appendChild(overlay);
}

// 更新项目图片预览函数
function showProjectImages(index, images) {
    const src = images[index];
    const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');
    
    // 显示当前图片
    showPreview(src, isVideo);
    
    // 预加载下一张图片
    const nextIndex = (index + 1) % images.length;
    if (nextIndex !== index) {
        const nextSrc = images[nextIndex];
        PreloadManager.preload(nextSrc).catch(() => {
            console.warn(`Failed to preload: ${nextSrc}`);
        });
    }
}

// 初始化项目图片库
function initializeProjectGallery(images) {
    // 先加载可见区域的图片
    const visibleImages = images.slice(0, 5);
    PreloadManager.preloadAll(visibleImages)
        .then(() => {
            // 然后在后台加载其余图片
            const remainingImages = images.slice(5);
            if (remainingImages.length > 0) {
                PreloadManager.preloadAll(remainingImages);
            }
        });
}

// 项目图片数组
const archProjectImages = [
    'images/arch1.jpg',
    'images/arch2.jpg',
    'images/arch3.jpg',
    'images/arch4.jpg',
    'images/arch5.jpg',
    'images/arch6.jpg',
    'images/arch7.jpg',
    'images/arch8.jpg',
    'images/arch9.jpg',
    'images/arch10.jpg',
    'images/arch11.jpg',
    'images/arch12.jpg',
    'images/arch13.jpg',
    'images/arch14.jpg',
    'images/arch15.jpg',
    'images/arch16.jpg',
    'images/arch17.jpg',
    'images/arch18.jpg',
    'images/arch19.jpg',
    'images/arch20.jpg',
    'images/arch21.jpg',
    'images/arch22.jpg',
    'images/arch23.jpg',
    'images/arch24.jpg',
    'images/arch25.jpg',
    'images/arch26.jpg',
    'images/arch27.jpg',
    'images/arch28.jpg',
    'images/arch29.jpg',
    'images/arch30.jpg',
    'images/arch31.jpg',
    'images/arch32.jpg',
    'images/arch33.jpg',
    'images/arch34.jpg',
    'images/arch35.jpg',
    'images/arch36.jpg',
    'images/arch37.jpg',
    'images/arch38.jpg',
    'images/arch39.jpg',
    'images/arch40.jpg',
    'images/arch41.jpg',
    'images/arch42.jpg',
    'images/arch43.jpg',
    'images/arch44.jpg',
    'images/arch45.jpg',
    'images/arch46.jpg',
    'images/arch47.jpg',
    'images/arch48.jpg',
    'images/arch49.jpg',
    'images/arch50.jpg',
    'images/arch51.jpg',
    'images/arch52.jpg',
    'images/arch53.jpg',
    'images/arch54.jpg',
    'images/arch55.jpg',
    'images/arch56.jpg',
    'images/arch57.jpg',
    'images/arch58.jpg',
    'images/arch59.jpg',
    'images/arch60.jpg',
    'images/arch61.jpg',
    'images/arch62.jpg',
    'images/arch63.jpg',
    'images/arch64.jpg',
    'images/arch65.jpg',
    'images/arch66.jpg',
    'images/arch67.jpg',
    'images/arch68.jpg',
    'images/arch69.jpg',
    'images/arch70.jpg',
    'images/arch71.jpg',
    'images/arch72.jpg',
    'images/arch73.jpg',
    'images/arch74.jpg',
    'images/arch75.jpg',
    'images/arch76.jpg',
    'images/arch77.jpg',
    'images/arch78.jpg',
    'images/arch79.jpg',
    'images/arch80.jpg',
    'images/arch81.jpg',
    'images/arch82.jpg',
    'images/arch83.jpg',
    'images/arch84.jpg',
    'images/arch85.jpg',
    'images/arch86.jpg',
    'images/arch87.jpg',
    'images/arch88.jpg',
    'images/arch89.jpg',
    'images/arch90.jpg',
    'images/arch91.jpg',
    'images/arch92.jpg',
    'images/arch93.jpg',
    'images/arch94.jpg',
    'images/arch95.jpg',
    'images/arch96.jpg',
    'images/arch97.jpg',
    'images/arch98.jpg',
    'images/arch99.jpg',
    'images/arch100.jpg',
    'images/arch101.jpg',
    'images/arch102.jpg',
    'images/arch103.jpg',
    'images/arch104.jpg',
    'images/arch105.jpg',
    'images/arch106.jpg',
    'images/arch107.jpg',
    'images/arch108.jpg',
    'images/arch109.jpg',
    'images/arch110.jpg',
    'images/arch111.jpg',
    'images/arch112.jpg',
    'images/arch113.jpg',
    'images/arch114.jpg',
    'images/arch115.jpg',
    'images/arch116.jpg',
    'images/arch117.jpg',
    'images/arch118.jpg',
    'images/arch119.jpg',
    'images/arch120.jpg',
    'images/arch121.jpg',
    'images/arch122.jpg',
    'images/arch123.jpg',
    'images/arch124.jpg',
    'images/arch125.jpg',
    'images/arch126.jpg',
    'images/arch127.jpg',
    'images/arch128.jpg',
    'images/arch129.jpg',
    'images/arch130.jpg',
    'images/arch131.jpg',
    'images/arch132.jpg',
    'images/arch133.jpg',
    'images/arch134.jpg',
    'images/arch135.jpg',
    'images/arch136.jpg',
    'images/arch137.jpg',
    'images/arch138.jpg',
    'images/arch139.jpg',
    'images/arch140.jpg',
    'images/arch141.jpg',
    'images/arch142.jpg',
    'images/arch143.jpg',
    'images/arch144.jpg',
    'images/arch145.jpg',
    'images/arch146.jpg',
    'images/arch147.jpg',
    'images/arch148.jpg',
    'images/arch149.jpg',
    'images/arch150.jpg',
    'images/arch151.jpg',
    'images/arch152.jpg',
    'images/arch153.jpg',
    'images/arch154.jpg',
    'images/arch155.jpg',
    'images/arch156.jpg',
    'images/arch157.jpg',
    'images/arch158.jpg',
    'images/arch159.jpg',
    'images/arch160.jpg',
    'images/arch161.jpg',
    'images/arch162.jpg',
    'images/arch163.jpg',
    'images/arch164.jpg',
    'images/arch165.jpg',
    'images/arch166.jpg',
    'images/arch167.jpg',
    'images/arch168.jpg',
    'images/arch169.jpg',
    'images/arch170.jpg',
    'images/arch171.jpg',
    'images/arch172.jpg',
    'images/arch173.jpg',
    'images/arch174.jpg',
    'images/arch175.jpg',
    'images/arch176.jpg',
    'images/arch177.jpg',
    'images/arch178.jpg',
    'images/arch179.jpg',
    'images/arch180.jpg',
    'images/arch181.jpg',
    'images/arch182.jpg',
    'images/arch183.jpg',
    'images/arch184.jpg',
    'images/arch185.jpg',
    'images/arch186.jpg',
    'images/arch187.jpg',
    'images/arch188.jpg',
    'images/arch189.jpg',
    'images/arch190.jpg',
    'images/arch191.jpg',
    'images/arch192.jpg',
    'images/arch193.jpg',
    'images/arch194.jpg',
    'images/arch195.jpg',
    'images/arch196.jpg',
    'images/arch197.jpg',
    'images/arch198.jpg',
    'images/arch199.jpg',
    'images/arch200.jpg'
];
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeProjectGallery(archProjectImages);
});

// 导出函数供HTML使用
window.showArchProjectImages = function(index) {
    showProjectImages(index, archProjectImages);
};

