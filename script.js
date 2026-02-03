/**
 * 大连天乙刀具有限公司网站交互脚本
 * 版本：2.0
 * 日期：2026年2月
 */

// 全局变量
let navLinks, mobileMenuBtn;

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    
    // 获取DOM元素
    mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    navLinks = document.querySelector('.nav-links');
    
    // 初始化导航
    initNavigation();
    
    // 添加图片加载错误处理
    initImageErrorHandling();
    
    // 初始化表单验证（如果需要未来添加表单）
    initFormValidation();
    
    // 初始化页面
    console.log('天乙刀具网站已加载完成');
    
    // 添加页面加载动画
    initPageAnimations();
});

/**
 * 初始化导航功能
 */
function initNavigation() {
    // 移动菜单切换功能
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // 平滑滚动到锚点链接
    initSmoothScrolling();
    
    // 监听滚动事件，更新活动导航链接
    window.addEventListener('scroll', handleScroll);
    
    // 监听窗口大小变化，调整导航显示
    window.addEventListener('resize', handleResize);
    
    // 初始更新导航栏激活状态
    updateActiveNavLink();
    
    // 检查URL中是否有锚点，如果有，则根据锚点设置激活状态
    const hash = window.location.hash;
    if (hash) {
        updateActiveNavLink(hash);
    }
}

/**
 * 切换移动菜单显示/隐藏
 */
function toggleMobileMenu() {
    if (!navLinks) return;
    
    navLinks.classList.toggle('active');
    
    // 切换菜单按钮图标
    const icon = this.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

/**
 * 初始化平滑滚动
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // 如果是"#"则返回顶部
            if (targetId === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            // 如果是页面链接（如about.html），不阻止默认行为，让浏览器处理
            if (targetId.includes('.html')) {
                return;
            }
            
            // 处理锚点链接
            e.preventDefault();
            scrollToSection(targetId);
        });
    });
}

/**
 * 滚动到指定区域
 */
function scrollToSection(targetId) {
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        // 计算滚动位置（考虑固定导航栏的高度）
        const offsetTop = targetElement.offsetTop - 70;
        
        // 平滑滚动到目标位置
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // 在移动端，点击链接后隐藏菜单
        if (window.innerWidth < 768 && navLinks) {
            closeMobileMenu();
        }
        
        // 更新活动导航链接
        updateActiveNavLink(targetId);
    }
}

/**
 * 关闭移动菜单
 */
function closeMobileMenu() {
    if (!navLinks || !mobileMenuBtn) return;
    
    navLinks.classList.remove('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
}

/**
 * 根据当前页面或滚动位置更新活动导航链接
 */
function updateActiveNavLink(targetId = null) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-links a');
    
    // 移除所有active类
    allNavLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 如果有指定的targetId，根据它设置active状态
    if (targetId) {
        const targetLink = document.querySelector(`.nav-links a[href="${targetId}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
        return;
    }
    
    // 根据当前页面设置active状态
    if (currentPage === 'index.html' || currentPage === '') {
        // 在主页，根据滚动位置设置active状态
        let currentSection = '';
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        if (currentSection) {
            const activeLink = document.querySelector(`.nav-links a[href="${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        } else {
            // 默认设置首页链接为active
            const homeLink = document.querySelector('.nav-links a[href="index.html"], .nav-links a[href="#"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    } else {
        // 在子页面，根据当前页面设置active状态
        // 支持所有子页面，不仅仅是about.html和products.html
        const activeLink = document.querySelector(`.nav-links a[href="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

/**
 * 处理滚动事件
 */
function handleScroll() {
    // 更新活动导航链接
    updateActiveNavLink();
    
    // 滚动动画效果
    const elements = document.querySelectorAll('.service-card, .product-card, .about-content');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

/**
 * 处理窗口大小变化
 */
function handleResize() {
    // 如果窗口宽度大于768px，确保导航显示正确
    if (window.innerWidth > 768 && navLinks) {
        navLinks.classList.remove('active');
        
        if (mobileMenuBtn) {
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
}

/**
 * 初始化图片错误处理
 */
function initImageErrorHandling() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // 如果图片加载失败，显示备用图标
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = `
                <i class="fas fa-image"></i>
                <span>图片加载中...</span>
            `;
            this.parentNode.appendChild(placeholder);
        });
    });
}

/**
 * 初始化表单验证
 */
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 这里可以添加表单验证逻辑
            alert('感谢您的联系，我们会尽快回复您！');
            this.reset();
        });
    }
}

/**
 * 初始化页面动画
 */
function initPageAnimations() {
    // 页面淡入效果
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 为卡片添加初始动画
    const cards = document.querySelectorAll('.service-card, .product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
}


/**
 * 处理服务卡片链接点击
 */
function initServiceCardLinks() {
    const serviceCardLinks = document.querySelectorAll('.service-card-link[href="#"]');
    
    serviceCardLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 如果链接是#，表示该页面尚未创建
            if (href === '#') {
                e.preventDefault();
                
                // 获取卡片标题，用于显示提示信息
                const cardTitle = this.querySelector('h3')?.textContent || '此服务';
                
                // 显示友好提示
                alert(`${cardTitle}的详细页面正在建设中，敬请期待！`);
                
                // 或者可以跳转到联系页面
                // window.location.href = 'index.html#contact';
            }
        });
    });
}

// 在DOMContentLoaded事件中调用初始化
document.addEventListener('DOMContentLoaded', function() {
    // ... 其他初始化代码 ...
    
    // 初始化服务卡片链接
    initServiceCardLinks();
    
    // ... 其他初始化代码 ...
});