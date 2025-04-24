class SeamCarver {
    constructor(imageData) {
        this.imageData = imageData;
        this.width = imageData.width;
        this.height = imageData.height;
        this.pixels = new Uint8ClampedArray(imageData.data);
    }

    // 计算能量图
    calculateEnergyMap() {
        const energyMap = new Float64Array(this.width * this.height);
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                energyMap[y * this.width + x] = this.calculatePixelEnergy(x, y);
            }
        }
        
        return energyMap;
    }

    // 计算单个像素的能量值
    calculatePixelEnergy(x, y) {
        const left = this.getPixel(x - 1, y);
        const right = this.getPixel(x + 1, y);
        const up = this.getPixel(x, y - 1);
        const down = this.getPixel(x, y + 1);

        // 计算 x 方向的梯度
        const dx = Math.pow(right.r - left.r, 2) +
                  Math.pow(right.g - left.g, 2) +
                  Math.pow(right.b - left.b, 2);

        // 计算 y 方向的梯度
        const dy = Math.pow(down.r - up.r, 2) +
                  Math.pow(down.g - up.g, 2) +
                  Math.pow(down.b - up.b, 2);

        return Math.sqrt(dx + dy);
    }

    // 获取像素值，处理边界情况
    getPixel(x, y) {
        x = Math.max(0, Math.min(x, this.width - 1));
        y = Math.max(0, Math.min(y, this.height - 1));
        const idx = (y * this.width + x) * 4;
        return {
            r: this.pixels[idx],
            g: this.pixels[idx + 1],
            b: this.pixels[idx + 2]
        };
    }

    // 找到最小能量缝隙
    findVerticalSeam(energyMap) {
        const dp = new Float64Array(this.width * this.height);
        const backtrack = new Int32Array(this.width * this.height);

        // 初始化第一行
        for (let x = 0; x < this.width; x++) {
            dp[x] = energyMap[x];
        }

        // 动态规划计算最小能量路径
        for (let y = 1; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let minEnergy = dp[(y-1) * this.width + x];
                let minX = x;

                if (x > 0 && dp[(y-1) * this.width + (x-1)] < minEnergy) {
                    minEnergy = dp[(y-1) * this.width + (x-1)];
                    minX = x - 1;
                }
                if (x < this.width - 1 && dp[(y-1) * this.width + (x+1)] < minEnergy) {
                    minEnergy = dp[(y-1) * this.width + (x+1)];
                    minX = x + 1;
                }

                dp[y * this.width + x] = energyMap[y * this.width + x] + minEnergy;
                backtrack[y * this.width + x] = minX;
            }
        }

        // 找到最后一行中能量最小的位置
        let minX = 0;
        let minEnergy = dp[(this.height - 1) * this.width];
        for (let x = 1; x < this.width; x++) {
            if (dp[(this.height - 1) * this.width + x] < minEnergy) {
                minEnergy = dp[(this.height - 1) * this.width + x];
                minX = x;
            }
        }

        // 回溯找到整条缝隙
        const seam = new Int32Array(this.height);
        seam[this.height - 1] = minX;
        for (let y = this.height - 2; y >= 0; y--) {
            seam[y] = backtrack[(y + 1) * this.width + seam[y + 1]];
        }

        return seam;
    }

    // 移除一条垂直缝隙
    removeVerticalSeam(seam) {
        const newWidth = this.width - 1;
        const newPixels = new Uint8ClampedArray(newWidth * this.height * 4);

        for (let y = 0; y < this.height; y++) {
            const seamX = seam[y];
            for (let x = 0; x < newWidth; x++) {
                const oldX = x >= seamX ? x + 1 : x;
                const oldIdx = (y * this.width + oldX) * 4;
                const newIdx = (y * newWidth + x) * 4;
                
                newPixels[newIdx] = this.pixels[oldIdx];
                newPixels[newIdx + 1] = this.pixels[oldIdx + 1];
                newPixels[newIdx + 2] = this.pixels[oldIdx + 2];
                newPixels[newIdx + 3] = this.pixels[oldIdx + 3];
            }
        }

        this.width = newWidth;
        this.pixels = newPixels;
    }

    // 主函数：缩小图片
    resize(targetWidth) {
        if (targetWidth >= this.width) {
            // 如果目标宽度大于等于当前宽度，直接返回原始图像数据
            return new ImageData(this.pixels, this.width, this.height);
        }

        const seamCount = this.width - targetWidth;
        console.log(`Removing ${seamCount} seams...`);

        for (let i = 0; i < seamCount; i++) {
            const energyMap = this.calculateEnergyMap();
            const seam = this.findVerticalSeam(energyMap);
            this.removeVerticalSeam(seam);
            console.log(`Removed seam ${i + 1}/${seamCount}`);
        }

        return new ImageData(this.pixels, this.width, this.height);
    }
}

// 导出 SeamCarver 类
window.SeamCarver = SeamCarver;
