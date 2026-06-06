export const getCutNum = (frameNum) => {
    if (frameNum == 4) return 4;
    else return frameNum + 1;
}

export const getImgSize = (frameNum) => {
    if (frameNum == 1) {
        return { width: 1000, height: 600 };
    } else if (frameNum == 2) {
        return { width: 900, height: 500 };
    } else if (frameNum == 3) {
        return { width: 650, height: 525 };
    } else if (frameNum == 4) {
        return { width: 510, height: 350 };
    } 

    return { width, height };
}

export const makeButton = (text, clickFunc) => {
    const btn = document.createElement('button');
    btn.innerHTML = text;
    btn.className = 'btn';
    btn.id = 'btn';
    btn.onclick = clickFunc;
    return btn;
}

