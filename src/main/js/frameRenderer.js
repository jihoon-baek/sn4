import { getImgSize } from './utils';

// Color theme configuration
const colors = [
    { name: 'black', textColor: 'white', bgColor: '#000000' },
    { name: 'white', textColor: 'black', bgColor: '#FFFFFF' },
    { name: 'pink', textColor: 'white', bgColor: 'rgb(245 188 188)' },
    { name: 'pink beige', textColor: 'white', bgColor: 'rgb(215 197 197)' },
    { name: 'blue', textColor: 'white', bgColor: 'rgb(100 150 213)' },
    { name: 'deep blue', textColor: 'white', bgColor: 'rgb(19 39 72)' },
    { name: 'skyblue', textColor: 'white', bgColor: 'rgb(188 224 245)' },
    { name: 'purple', textColor: 'white', bgColor: 'rgb(208 182 239)' },
    { name: 'light green', textColor: 'white', bgColor: 'rgb(194 228 160)' },
    { name: 'yellow', textColor: 'white', bgColor: 'rgb(255 224 132)' },
];

export const getColors = () => colors;

// Return today's date in YYYYMMDD format
const getDateStr = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}${month}${day}`;
};

/**
 * Dynamically builds a frame DOM element.
 * @param {number} frameNum - The chosen frame (1: 2 Cuts, 2: 3 Cuts, 3: 4 Cuts Horiz, 4: 4 Cuts Vert)
 * @param {number} bgIndex - Background color index
 * @param {number} scale - Scaling factor (e.g. 0.3 for Step 4)
 * @param {HTMLElement[]} photoElements - Array of canvas/img elements to insert. If empty, placeholders are rendered.
 */
export const renderFrame = (frameNum, bgIndex, scale, photoElements = []) => {
    const bgInfo = colors[bgIndex] || colors[0];

    const preview = document.createElement('div');
    preview.style.backgroundColor = bgInfo.bgColor;
    preview.style.position = 'relative';
    preview.style.boxSizing = 'border-box';
    preview.style.overflow = 'hidden';

    const imgContainer = document.createElement('div');
    imgContainer.style.position = 'absolute';
    imgContainer.style.display = 'grid';

    const logoText = document.createElement('div');
    logoText.id = 'logoText';
    logoText.innerText = '사노\n네컷';
    logoText.style.color = bgInfo.textColor;
    logoText.style.fontFamily = 'LOTTERIACHAB';
    logoText.style.textAlign = 'center';
    logoText.style.position = 'absolute';

    const dateText = document.createElement('div');
    dateText.id = 'dateText';
    dateText.innerText = getDateStr();
    dateText.style.color = bgInfo.textColor;
    dateText.style.fontFamily = 'NEXON Lv1 Gothic OTF';
    dateText.style.position = 'absolute';
    dateText.style.opacity = '0.6';

    let frameW = 0;
    let frameH = 0;
    const { width: imgW, height: imgH } = getImgSize(frameNum);

    if (frameNum == 1) {
        frameW = 1200;
        frameH = 1800;
        imgContainer.style.gridTemplateRows = '1fr 1fr';
        imgContainer.style.top = `${50 * (scale / 0.3)}px`;
        imgContainer.style.left = '50%';
        imgContainer.style.marginLeft = `${-((imgW * scale / 2) + 5 * (scale / 0.3))}px`;

        logoText.style.width = `${90 * (scale / 0.3)}px`;
        logoText.style.height = `${90 * (scale / 0.3)}px`;
        logoText.style.left = '50%';
        logoText.style.marginLeft = `${-45 * (scale / 0.3)}px`;
        logoText.style.fontSize = `${30 * (scale / 0.3)}px`;
        logoText.style.lineHeight = `${30 * (scale / 0.3)}px`;
        logoText.style.bottom = `${10 * (scale / 0.3)}px`;

        dateText.style.width = `${100 * (scale / 0.3)}px`;
        dateText.style.height = `${20 * (scale / 0.3)}px`;
        dateText.style.fontSize = `${8 * (scale / 0.3)}px`;
        dateText.style.lineHeight = `${8 * (scale / 0.3)}px`;
        dateText.style.bottom = `${5 * (scale / 0.3)}px`;
        dateText.style.left = '50%';
        dateText.style.marginLeft = `${-50 * (scale / 0.3)}px`;
        dateText.style.textAlign = 'center';
    } else if (frameNum == 2) {
        frameW = 1000;
        frameH = 1800;
        imgContainer.style.gridTemplateRows = '1fr 1fr 1fr';
        imgContainer.style.top = `${10 * (scale / 0.3)}px`;
        imgContainer.style.left = '50%';
        imgContainer.style.marginLeft = `${-((imgW * scale / 2) + 2.5 * (scale / 0.3))}px`;

        logoText.style.width = `${60 * (scale / 0.3)}px`;
        logoText.style.height = `${60 * (scale / 0.3)}px`;
        logoText.style.left = '50%';
        logoText.style.marginLeft = `${-30 * (scale / 0.3)}px`;
        logoText.style.fontSize = `${18 * (scale / 0.3)}px`;
        logoText.style.lineHeight = `${18 * (scale / 0.3)}px`;
        logoText.style.bottom = `${-5 * (scale / 0.3)}px`;

        dateText.style.width = `${100 * (scale / 0.3)}px`;
        dateText.style.height = `${10 * (scale / 0.3)}px`;
        dateText.style.fontSize = `${6 * (scale / 0.3)}px`;
        dateText.style.lineHeight = `${6 * (scale / 0.3)}px`;
        dateText.style.bottom = `${5 * (scale / 0.3)}px`;
        dateText.style.left = '50%';
        dateText.style.marginLeft = `${-50 * (scale / 0.3)}px`;
        dateText.style.textAlign = 'center';
    } else if (frameNum == 3) {
        frameW = 1800;
        frameH = 1200;
        imgContainer.style.gridTemplateRows = '1fr 1fr';
        imgContainer.style.gridTemplateColumns = '1fr 1fr';
        imgContainer.style.top = `${16 * (scale / 0.3)}px`;
        imgContainer.style.left = `${20 * (scale / 0.3)}px`;

        logoText.style.width = `${60 * (scale / 0.3)}px`;
        logoText.style.height = `${60 * (scale / 0.3)}px`;
        logoText.style.fontSize = `${25 * (scale / 0.3)}px`;
        logoText.style.lineHeight = `${25 * (scale / 0.3)}px`;
        logoText.style.top = `${30 * (scale / 0.3)}px`;
        logoText.style.right = `${50 * (scale / 0.3)}px`;

        dateText.style.width = `${60 * (scale / 0.3)}px`;
        dateText.style.height = `${60 * (scale / 0.3)}px`;
        dateText.style.fontSize = `${6 * (scale / 0.3)}px`;
        dateText.style.lineHeight = `${6 * (scale / 0.3)}px`;
        dateText.style.top = `${88 * (scale / 0.3)}px`;
        dateText.style.right = `${50 * (scale / 0.3)}px`;
    } else if (frameNum == 4) {
        frameW = 600;
        frameH = 1800;
        imgContainer.style.gridTemplateRows = '1fr 1fr 1fr 1fr';
        imgContainer.style.left = '50%';
        imgContainer.style.marginLeft = `${-((imgW * scale / 2) + 5 * (scale / 0.3))}px`;
        imgContainer.style.bottom = `${15 * (scale / 0.3)}px`;

        logoText.style.width = `${60 * (scale / 0.3)}px`;
        logoText.style.height = `${60 * (scale / 0.3)}px`;
        logoText.style.left = '50%';
        logoText.style.marginLeft = `${-30 * (scale / 0.3)}px`;
        logoText.style.fontSize = `${20 * (scale / 0.3)}px`;
        logoText.style.lineHeight = `${20 * (scale / 0.3)}px`;
        logoText.style.top = `${20 * (scale / 0.3)}px`;

        dateText.style.width = `${100 * (scale / 0.3)}px`;
        dateText.style.height = `${10 * (scale / 0.3)}px`;
        dateText.style.fontSize = `${6 * (scale / 0.3)}px`;
        dateText.style.lineHeight = `${6 * (scale / 0.3)}px`;
        dateText.style.top = `${70 * (scale / 0.3)}px`;
        dateText.style.left = '50%';
        dateText.style.marginLeft = `${-50 * (scale / 0.3)}px`;
        dateText.style.textAlign = 'center';
    }

    preview.style.width = `${frameW * scale}px`;
    preview.style.height = `${frameH * scale}px`;

    const numPhotosNeeded = (frameNum === 4) ? 4 : (frameNum + 1);
    for (let i = 0; i < numPhotosNeeded; i++) {
        const imgDiv = document.createElement('div');
        imgDiv.style.width = `${imgW * scale}px`;
        imgDiv.style.height = `${imgH * scale}px`;
        imgDiv.style.objectFit = 'cover';
        imgDiv.style.margin = `${2.5 * (scale / 0.3)}px`;
        imgDiv.style.boxSizing = 'border-box';

        if (photoElements[i]) {
            const el = photoElements[i];
            el.style.width = `${imgW * scale}px`;
            el.style.height = `${imgH * scale}px`;
            el.style.objectFit = 'cover';
            imgDiv.appendChild(el);
        } else {
            // Placeholder styles (cute, clean border and layout)
            imgDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.45)';
            imgDiv.style.border = `${1 * (scale / 0.3)}px dashed rgba(0, 0, 0, 0.15)`;
            imgDiv.style.display = 'flex';
            imgDiv.style.alignItems = 'center';
            imgDiv.style.justifyContent = 'center';
            imgDiv.style.color = bgInfo.textColor;
            imgDiv.style.fontFamily = 'NEXON Lv2 Gothic';
            imgDiv.style.fontSize = `${10 * (scale / 0.3)}px`;
            imgDiv.style.opacity = '0.7';
            imgDiv.innerText = `PHOTO ${i + 1}`;
        }
        imgContainer.appendChild(imgDiv);
    }

    preview.appendChild(imgContainer);
    preview.appendChild(logoText);
    preview.appendChild(dateText);

    // Add SANO mascot image at the bottom-right of the frame
    const mascotSano = document.createElement('img');
    mascotSano.src = 'assets/images/sano.png';
    mascotSano.style.position = 'absolute';
    mascotSano.style.bottom = '0px';
    mascotSano.style.right = '0px';
    mascotSano.style.width = 'auto';
    mascotSano.style.zIndex = '55';

    // Add Indonesia mascot image at the bottom-left of the frame
    const mascotIndo = document.createElement('img');
    mascotIndo.src = 'assets/images/indonesia.png';
    mascotIndo.style.position = 'absolute';
    mascotIndo.style.bottom = '0px';
    mascotIndo.style.left = '0px';
    mascotIndo.style.width = 'auto';
    mascotIndo.style.zIndex = '50';

    // Add SANO2 mascot image at the top of the frame (flipped)
    const mascotSano2 = document.createElement('img');
    mascotSano2.src = 'assets/images/sano2.png';
    mascotSano2.style.position = 'absolute';
    mascotSano2.style.top = '0px';
    mascotSano2.style.width = 'auto';
    mascotSano2.style.zIndex = '56';

    let sanoH = 0;
    let indoH = 0;
    let sano2H = 0;

    let sano2Left = '';
    let sano2Right = '';
    let sano2Transform = 'rotate(180deg)';

    if (frameNum == 1) {
        sanoH = 180 * (scale / 0.3);
        indoH = 180 * (scale / 0.3);
        sano2H = 180 * (scale / 0.3);
        sano2Left = '50%';
        sano2Transform = 'translateX(-50%) rotate(180deg)';
    } else if (frameNum == 2) {
        sanoH = 180 * (scale / 0.3);
        indoH = 180 * (scale / 0.3);
        sano2H = 180 * (scale / 0.4);
        sano2Left = '50%';
        sano2Transform = 'translateX(-50%) rotate(180deg)';
    } else if (frameNum == 3) {
        sanoH = 220 * (scale / 0.3);
        indoH = 170 * (scale / 0.3);
        sano2H = 180 * (scale / 0.3);
        sano2Left = '40%';
        sano2Transform = 'translateX(-50%) rotate(180deg)';
    } else if (frameNum == 4) {
        sanoH = 100 * (scale / 0.3);
        indoH = 100 * (scale / 0.3);
        sano2H = 100 * (scale / 0.25);
        sano2Right = '0px';
        sano2Transform = 'rotate(180deg)';
    }

    mascotSano.style.height = `${sanoH}px`;
    mascotIndo.style.height = `${indoH}px`;
    mascotSano2.style.height = `${sano2H}px`;

    if (sano2Left) mascotSano2.style.left = sano2Left;
    if (sano2Right) mascotSano2.style.right = sano2Right;
    mascotSano2.style.transform = sano2Transform;

    preview.appendChild(mascotSano);
    preview.appendChild(mascotIndo);
    preview.appendChild(mascotSano2);

    return preview;
};
