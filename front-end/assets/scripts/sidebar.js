sidebarItems.forEach((item) => {
    const li = item.parentElement;
    li.addEventListener('click', () => {
        sidebarItems.forEach((item) =>
            item.parentElement.classList.remove('active'),
        );
        li.classList.add('active')
    });
});
