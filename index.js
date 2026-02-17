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
    return template.replace(/\{\{(.*?)\}\}/g, (match, path) => {
        const cleanPath = path.trim().replace(/\[(\d+)\]/g, '.$1');
        const value = cleanPath.split('.').reduce((obj, key) => {
            return (obj && obj[key] !== undefined) ? obj[key] : undefined;
        }, data);
        return value !== undefined ? value : "";
    });
}

/**
 * Fetches text content from a given URL.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<string>} A promise that resolves with the text content.
 */
async function fetchTemplate(fileName) {
    const response = await fetch(fileName); 
    if (!response.ok) {
        throw new Error(`Failed to fetch ${fileName}: ${response.statusText}`);
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
    if (!container || !data.nav) return;
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
    if (!container || !data.personal_info) return;
    let renderedHtml = render(template, data);
    const connectionsHtml = data.personal_info.connections.map(item => `
        <div class="connection">
            <i class="${item.icon} social-media-link"></i>
            ${item.text}
        </div>
    `).join('');
    container.innerHTML = renderedHtml.replace('class="connection-group">', `class="connection-group">${connectionsHtml}`);
}

/**
 * Renders the skills section.
 * @param {HTMLElement} container - The target element to render into.
 * @param {string} template - The HTML template for skills.
 * @param {object} data - The application data.
 */
function renderSkills(container, template, data) {
    if (!container || !data.skills_section) return;
    let renderedHtml = render(template, data);
    const skillsHtml = data.skills_section.skills.map(skill => `
        <div class="col-12 col-md-4">
            <h3 class="skill-name">${skill.name}</h3>
            <p class="skill-info">${skill.info}</p>
            <ul>${skill.items.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
    `).join('');
    renderedHtml = renderedHtml.replace('id="skills-list">', `id="skills-list">${skillsHtml}`);

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
    renderedHtml = renderedHtml.replace('id="certificates-list">', `id="certificates-list">${certificatesHtml}`);
    container.innerHTML = renderedHtml;
}

function renderSummary(container, template, data) {
    if (!container || !data.summary_section) return;
    let renderedHtml = render(template, data);
    const content = data.summary_section.content.replace(/\n/g, '<br>');
    renderedHtml = renderedHtml.replace('id="summary-text">', `id="summary-text">${content}`);

    container.innerHTML = renderedHtml;
}

/**
 * Renders the portfolio section.
 * @param {HTMLElement} container - The target element to render into.
 * @param {string} template - The HTML template for the portfolio.
 * @param {object} data - The application data.
 */
function renderPortfolio(container, template, data) {
    if (!container || !data.portfolio_section) return;
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
    container.innerHTML = renderedHtml.replace('id="portfolio-list">', `id="portfolio-list">${projectsHtml}`);
}

/**
 * Renders the Chinese autobiography section.
 * @param {HTMLElement} container - The target element to render into.
 * @param {string} template - The HTML template for the autobiography.
 * @param {object} data - The application data.
 */
function renderAutobiographyCh(container, template, data) {
    if (!container || !data.autobiography_section) return;
    
    let renderedHtml = render(template, data);
    const paragraphsHtml = data.autobiography_section.paragraphs_ch.map(p => `<p class="description">${p}</p>`).join('');
    
    container.innerHTML = renderedHtml.replace('id="autobio-ch-paragraphs">', `id="autobio-ch-paragraphs">${paragraphsHtml}`);
}

/**
 * Renders the English autobiography section.
 * @param {HTMLElement} container - The target element to render into.
 * @param {string} template - The HTML template for the autobiography.
 * @param {object} data - The application data.
 */
function renderAutobiographyEn(container, template, data) {
    if (!container || !data.autobiography_section) return;
    
    let renderedHtml = render(template, data);
    const paragraphsHtml = data.autobiography_section.paragraphs_en.map(p => `<p class="description-en">${p}</p>`).join('');
    
    container.innerHTML = renderedHtml.replace('id="autobio-en-paragraphs">', `id="autobio-en-paragraphs">${paragraphsHtml}`);
}

/**
 * Renders the experience section.
 * @param {HTMLElement} container - The target element to render into.
 * @param {string} template - The HTML template for the experience.
 * @param {object} data - The application data.
 */
function renderExperience(container, template, data) {
    if (!container || !data.experience_section) return;

    let renderedHtml = render(template, data);
    
    const jobsHtml = data.experience_section.jobs.map((job, index) => {
        const descriptions = Array.isArray(job.description) ? job.description : [];
        const descListHtml = descriptions.map(item => 
            `<li class="experience-detail">${item}</li>`
        ).join('');

        return `
            ${index > 0 ? '<hr />' : ''}
            <div class="experience-item">
                <h3 class="job-title">${job.title}</h3>
                <div class="job-note">
                    <span class="company"><i class="fa-solid fa-building"></i> ${job.company}</span>
                    <span class="duration"><i class="fa-solid fa-calendar-days"></i> ${job.duration}</span>
                </div>
                <ul class="experience-details-list">
                    ${descListHtml}
                </ul>
            </div>
        `;
    }).join('');

    container.innerHTML = renderedHtml.replace('id="experience-list">', `id="experience-list">${jobsHtml}`);
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
        // 1. 抓取 JSON 資料
        const dataResponse = await fetch('data.json');
        const data = await dataResponse.json();

        // 2. 抓取外部 HTML 模板檔案
        const templates = {
            header: await fetchTemplate('_header.html'),
            personalInfo: await fetchTemplate('_personal-info.html'),
            summary: await fetchTemplate('_summary-content.html'),
            skills: await fetchTemplate('_skills.html'),
            portfolio: await fetchTemplate('_portfolio.html'),
            autobioCh: await fetchTemplate('_autobiography-ch.html'),
            autobioEn: await fetchTemplate('_autobiography-en.html'),
            experience: await fetchTemplate('_experience.html')
        };

        // 3. 定義容器
        const containers = {
            header: document.getElementById('header-container'),
            personalInfo: document.getElementById('personal-info-container'),
            summary: document.getElementById('summary-container'),
            skills: document.getElementById('skills-container'),
            portfolio: document.getElementById('portfolio-container'),
            autobioCh: document.getElementById('autobiography-ch-container'),
            autobioEn: document.getElementById('autobiography-en-container'),
            experience: document.getElementById('experience-container'),
        };

        // 4. 依照順序渲染
        renderHeader(containers.header, templates.header, data);
        renderPersonalInfo(containers.personalInfo, templates.personalInfo, data);
        renderSummary(containers.summary, templates.summary, data);
        renderExperience(containers.experience, templates.experience, data);
        renderSkills(containers.skills, templates.skills, data);
        renderPortfolio(containers.portfolio, templates.portfolio, data);
        renderAutobiographyCh(containers.autobioCh, templates.autobioCh, data);
        renderAutobiographyEn(containers.autobioEn, templates.autobioEn, data);
        initializeEventListeners();

    } catch (error) {
        console.error("渲染失敗:", error);
    }
}

// --- Entry Point ---
document.addEventListener('DOMContentLoaded', main);