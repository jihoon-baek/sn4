export const constrast = (v, mag) => {
    v = v / 255.0
    v = (v - mag * Math.sin(2*(Math.PI)*v) / (4 * Math.PI))
    
    if (v < 0) v = 0;
    else if (v > 1) v = 1;
    return (v * 255)
}

export const gamma_correction = (v, gamma) => {
    v = v / 255.0
    const result = v ** (1/gamma)
    return (result * 255)
}


export const grayscaleFilter = (pixels) => {
    const d = pixels.data;
    // image processing logic
    for (let i = 0; i < d.length; i+=4){
        const r = d[i];  
        const g = d[i+1];     
        const b = d[i+2];      
        const v = 0.2126*r + 0.7152*g + 0.0722*b;  // 보정값  
        // contrast
        d[i] = d[i+1] = d[i+2] = constrast(v, 0.3)
    }
    return pixels;
}

export const brightnessFilter = (pixels) => {
    const d = pixels.data;
    // image processing logic
    for (let i =0; i< d.length; i+=4) {
        d[i] = gamma_correction(d[i], 1.1);
        d[i+1] = gamma_correction(d[i+1], 1.1);
        d[i+2] = gamma_correction(d[i+2], 1.1);

        d[i] = constrast(d[i], 0.4)
        d[i+1] = constrast(d[i+1], 0.4)
        d[i+2] = constrast(d[i+2], 0.4)
    }
    return pixels;
}

export const colorEnhanceFilter = (pixels) => {
    const d = pixels.data;
    for (let i = 0; i < d.length; i+=4) {
        d[i] = gamma_correction(d[i], 1.1);
        d[i+1] = gamma_correction(d[i+1], 1.1);
        d[i+2] = gamma_correction(d[i+2], 1.1);

        d[i] = constrast(d[i], 0.4) * 1.1;
        d[i+1] = constrast(d[i+1], 0.4) * 1.1;
        d[i+2] = constrast(d[i+2], 0.4) * 1.1;
   }
   return pixels;
}
