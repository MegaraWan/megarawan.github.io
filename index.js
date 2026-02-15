// --- Helper Functions ---

/**
 * Checks if the screen width is 1024px or greater.
 * @returns {boolean} True if the screen is wide enough.
 */
function isSmallScreen() {
    return window.innerWidth >= 1024;
}

/**
 * Triggers the browser's print dialog.
 */
function printPage() {
    window.print();
}

/**
 * A simple template renderer. Replaces {{key}} with the value from the data object.
 * It can handle nested keys like {{personal_info.name_ch}}.
 * @param {string} template - The HTML template string.
 * @param {object} data - The data object.
 * @returns {string} The rendered HTML string.
 */
function render(template, data) {
    return template.replace(/\{\{([\w\.]*)\}\}/g, (match, key) => {
        return key.split('.').reduce((obj, i) => obj[i], data);
    });
}

/**
 * Fetches text content from a given URL.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<string>} A promise that resolves with the text content.
 */
async function fetchTemplate(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return response.text();
}


// --- Rendering Logic ---

/**
 * Renders the header section.
 * @param {HTMLElement} container - The target element to render into.
 * @param {string} template - The HTML template for the header.
 * @param {object} data - The application data.
 */
function renderHeader(container, template, data) {
    let renderedHtml = render(template, data);
    const socialLinksHtml = data.nav.social.map(item => `
        <a class="social-media-link" href="${item.href}" target="_blank" ${item.onclick ? `onclick="${item.onclick}"` : ''}>
            <i class="${item.icon}"></i>
        </a>
    `).join('');
    container.innerHTML = renderedHtml.replace('<div class="social-media"></div>', `<div class="social-media">${socialLinksHtml}</div>`);
}

/**
 * Renders the personal info section.
 * @param {HTMLElement} container - The target element to render into.
 * @param {string} template - The HTML template for personal info.
 * @param {object} data - The application data.
 */
function renderPersonalInfo(container, template, data) {
    let renderedHtml = render(template, data);
    const connectionsHtml = data.personal_info.connections.map(item => `
        <div class="connection">
            <i class="${item.icon} social-media-link"></i>
            ${item.text}
        </div>
    `).join('');
    container.innerHTML = renderedHtml.replace('<div class="connection-group"></div>', `<div class="connection-group">${connectionsHtml}</div>`);
}

/**
 * Renders the skills section.
 * @param {HTMLElement} container - The target element to render into.
 * @param {string} template - The HTML template for skills.
 * @param {object} data - The application data.
 */
function renderSkills(container, template, data) {
    let renderedHtml = render(template, data);

    const skillsHtml = data.skills_section.skills.map(skill => `
        <div class="col-12 col-md-4">
            <h3 class="skill-name">${skill.name}</h3>
            <p class="skill-info">${skill.info}</p>
            <ul>${skill.items.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
    `).join('');
    renderedHtml = renderedHtml.replace('<div class="skills" id="skills-list"></div>', `<div class="skills" id="skills-list">${skillsHtml}</div>`);

    const certificatesHtml = data.skills_section.certificates.items.map(cert => `
        <div class="col-12 col-md-6">
            <p class="skill-description">${cert.description}</p>
            <img class="skill-img" src="${cert.img_src}" alt="${cert.alt}" />
            <div class="more-item">
                <div class="more-inf">
                    <div class="more-base">
                        <span class="close">&times;</span>
                        <div class="scroll">
                            <img class="skill-img-big" src="${cert.img_src}" alt="${cert.alt}" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    renderedHtml = renderedHtml.replace('<div class="skills" id="certificates-list"></div>', `<div class="skills" id="certificates-list">${certificatesHtml}</div>`);

    container.innerHTML = renderedHtml;
}

/**
 * Renders the portfolio section.
 * @param {HTMLElement} container - The target element to render into.
 * @param {string} template - The HTML template for the portfolio.
 * @param {object} data - The application data.
 */
function renderPortfolio(container, template, data) {
    let renderedHtml = render(template, data);
    const projectsHtml = data.portfolio_section.projects.map(project => `
        <div class="col-12">
            <h3 class="skill-name">
                ${project.title} ${project.award ? `<span class="note">${project.award}</span>` : ''}
            </h3>
            <p>${project.description}</p>
            <a class="portfolio-link" href="${project.link}" target="_blank" rel="noopener noreferrer">
                ${project.images.map(img => `
                    <div class="portfolio-img-black index-farm-black">
                        <img class="portfolio-img" src="${img.src}" alt="${img.alt}" />
                    </div>
                `).join('')}
                <img class="portfolio-logo" src="${project.logo.src}" alt="${project.logo.alt}" />
            </a>
        </div>
    `).join('');
    container.innerHTML = renderedHtml.replace('<div class="skills" id="portfolio-list"></div>', `<div class="skills" id="portfolio-list">${projectsHtml}</div>`);
}

/**
 * Renders the Chinese autobiography section.
 * @param {HTMLElement} container - The target element to render into.
 * @param {string} template - The HTML template for the autobiography.
 * @param {object} data - The application data.
 */
function renderAutobiographyCh(container, template, data) {
    let renderedHtml = render(template, data);
    const paragraphsHtml = data.autobiography_section.paragraphs_ch.map(p => `<p class="description">${p}</p>`).join('');
    container.innerHTML = renderedHtml.replace('<div id="autobio-ch-paragraphs"></div>', `<div id="autobio-ch-paragraphs">${paragraphsHtml}</div>`);
}

/**
 * Renders the English autobiography section.
 * @param {HTMLElement} container - The target element to render into.
 * @param {string} template - The HTML template for the autobiography.
 * @param {object} data - The application data.
 */
function renderAutobiographyEn(container, template, data) {
    let renderedHtml = render(template, data);
    const paragraphsHtml = data.autobiography_section.paragraphs_en.map(p => `<p class="description-en">${p}</p>`).join('');
    container.innerHTML = renderedHtml.replace('<div id="autobio-en-paragraphs"></div>', `<div id="autobio-en-paragraphs">${paragraphsHtml}</div>`);
}

/**
 * Renders the experience section.
 * @param {HTMLElement} container - The target element to render into.
 * @param {string} template - The HTML template for the experience.
 * @param {object} data - The application data.
 */
function renderExperience(container, template, data) {
    let renderedHtml = render(template, data);
    const jobsHtml = data.experience_section.jobs.map((job, index) => `
        ${index > 0 ? '<hr />' : ''}
        <div class="experience-item">
            <h3 class="job-title">${job.title}</h3>
            <div class="job-note">
                <span class="company"><i class="fa-solid fa-building"></i>${job.company}</span>
                <span class="duration"><i class="fa-solid fa-calendar-days"></i>${job.duration}</span>
            </div>
            ${job.description.split('\n').map(p => `<p class="description">${p.trim()}</p>`).join('')}
        </div>
    `).join('');
    container.innerHTML = renderedHtml.replace('<div class="experience" id="experience-list"></div>', `<div class="experience" id="experience-list">${jobsHtml}</div>`);
}

/**
 * 使用事件委派優化的監聽器
 * 這樣不論是大頭照還是動態生成的證書，只要 class 對了就能觸發
 */
function initializeEventListeners() {
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;

    mainContainer.onclick = function (event) {
        if (!isSmallScreen()) return;

        const target = event.target;

        // 1. 處理點擊圖片
        if (target.classList.contains("skill-img")) {
            console.log("圖片被點擊了", target.src);

            // 邏輯：先找同層，再找父層容器內的彈窗
            let moreItem = target.nextElementSibling;

            if (!moreItem || !moreItem.classList.contains("more-item")) {
                // 這行會在大頭照所在的 .avatar 或是證書所在的 div 裡面搜尋 .more-item
                const parentContainer = target.closest('div'); 
                moreItem = parentContainer ? parentContainer.querySelector(".more-item") : null;
            }

            if (moreItem) {
                moreItem.style.display = "block";
            }
        }
        // 2. 處理關閉按鈕
        if (target.classList.contains("close")) {
            const moreItem = target.closest(".more-item");
            if (moreItem) moreItem.style.display = "none";
        }

        // 3. 點擊彈窗外圍關閉
        if (target.classList.contains("more-inf")) {
            const moreItem = target.closest(".more-item");
            if (moreItem) moreItem.style.display = "none";
        }
    };
}
// --- Main Application Logic ---

/**
 * Main function to fetch data, render templates, and initialize the page.
 */
async function main() {
    try {
        // 1. 只抓取資料
        const dataResponse = await fetch('data.json');
        const data = await dataResponse.json();

        // 2. 直接定義模板字串 (取代原本的 fetchTemplate)
        const templates = {
            header: `<nav><span class="nav-title">{{nav.title}}</span><div class="social-media"></div></nav>`,
            personalInfo: `
                <div class="content-group">
                    <div class="col-12 col-md-6">
                        <div class="avatar">
                            <img class="skill-img avatar-img" src="{{personal_info.avatar_img}}" alt="大頭照" />
                            <div class="more-item">
                                <div class="more-inf">
                                    <div class="more-base">
                                        <span class="close">&times;</span>
                                        <div class="scroll">
                                            <img class="skill-img-big" src="{{personal_info.avatar_img}}" alt="大頭照" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="personal">{{personal_info.dob}}</div>
                        <div class="personal">{{personal_info.education}}</div>
                    </div>
                    <div class="col-12 col-md-6">
                        <h1 class="name"><span>{{personal_info.name_ch}}</span> <span>{{personal_info.name_en}}</span></h1>
                        <div class="title">{{personal_info.title}}</div>
                        <div class="connection-group"></div>
                    </div>
                </div>`,
            skills: `<h2>{{skills_section.title}}</h2><div class="skills" id="skills-list"></div><h3>{{skills_section.certificates.title}}</h3><div class="skills" id="certificates-list"></div>`,
            portfolio: `<h2>{{portfolio_section.title}}<span class="note">{{portfolio_section.note}}</span></h2><div class="skills" id="portfolio-list"></div>`,
            autobioCh: `<h2>{{autobiography_section.title}}</h2><div id="autobio-ch-paragraphs"></div>`,
            autobioEn: `<h2>{{autobiography_section.title_en}}</h2><div id="autobio-en-paragraphs"></div>`,
            experience: `<h2>{{experience_section.title}}</h2><div class="experience" id="experience-list"></div>`
        };

        // 3. 獲取容器並渲染
        const containers = {
            header: document.getElementById('header-container'),
            personalInfo: document.getElementById('personal-info-container'),
            skills: document.getElementById('skills-container'),
            portfolio: document.getElementById('portfolio-container'),
            autobioCh: document.getElementById('autobiography-ch-container'),
            autobioEn: document.getElementById('autobiography-en-container'),
            experience: document.getElementById('experience-container'),
        };

        renderHeader(containers.header, templates.header, data);
        renderPersonalInfo(containers.personalInfo, templates.personalInfo, data);
        renderSkills(containers.skills, templates.skills, data);
        renderPortfolio(containers.portfolio, templates.portfolio, data);
        renderAutobiographyCh(containers.autobioCh, templates.autobioCh, data);
        renderAutobiographyEn(containers.autobioEn, templates.autobioEn, data);
        renderExperience(containers.experience, templates.experience, data);

        initializeEventListeners();

    } catch (error) {
        console.error("渲染失敗:", error);
    }
}

// --- Entry Point ---
document.addEventListener('DOMContentLoaded', main);