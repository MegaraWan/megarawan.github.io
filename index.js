function printPage() {
    window.print();
}
const more = document.querySelectorAll(".skill-img");
const moreItems = document.querySelectorAll(".more-item");
const closeButtons = document.querySelectorAll(".close");

// 顯示 more-item
more.forEach((button, index) => {
    button.addEventListener("click", () => {
        moreItems[index].style.display = "block";
    });
});

// 隱藏 more-item
closeButtons.forEach((closeButton, index) => {
    closeButton.addEventListener("click", () => {
        moreItems[index].style.display = "none";
    });
});

//點擊視窗其他地方隱藏 more-item
window.onclick = function(event) {
    moreItems.forEach((moreItem) => {
        // 檢查點擊的元素是否是 moreItem 或其子元素
        if (!moreItem.contains(event.target) && event.target !== moreItem && !event.target.classList.contains("skill-img")) {
            moreItem.style.display = "none";
        }
    });
};