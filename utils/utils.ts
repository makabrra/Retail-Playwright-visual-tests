import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ScreenshotComparisonResult } from '../config.types';

export class FileUtils {
    static async ensureDirectoryExists(dirPath: string): Promise<void> {
        try {
            await fs.access(dirPath);
        } catch {
            await fs.mkdir(dirPath, { recursive: true });
        }
    }

    static async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    static sanitizeFileName(fileName: string): string {
        return fileName.replace(/[\s\/\\:*?"<>|]+/g, '_');
    }
}

export class ScreenshotComparator {
    private threshold: number;
    private diffDir: string;

    constructor(threshold = 0.1, diffDir = 'test-artifacts/diff') {
        this.threshold = threshold;
        this.diffDir = diffDir;
    }

    async compareScreenshots(
        baselineBuffer: Buffer,
        currentBuffer: Buffer,
        testName: string
    ): Promise<ScreenshotComparisonResult> {
        try {
            const baselinePNG = PNG.sync.read(baselineBuffer);
            const currentPNG = PNG.sync.read(currentBuffer);

            if (baselinePNG.width !== currentPNG.width || baselinePNG.height !== currentPNG.height) {
                throw new Error(
                    `Screenshot dimensions don't match. Baseline: ${baselinePNG.width}x${baselinePNG.height}, ` +
                    `Current: ${currentPNG.width}x${currentPNG.height}`
                );
            }

            const { width, height } = baselinePNG;
            const totalPixels = width * height;
            const diff = new PNG({ width, height });

            const diffPixels = pixelmatch(
                baselinePNG.data,
                currentPNG.data,
                diff.data,
                width,
                height,
                { threshold: this.threshold }
            );

            const diffPercentage = (diffPixels / totalPixels) * 100;
            const isMatch = diffPercentage < this.threshold * 100;

            let diffImagePath: string | undefined;
            if (!isMatch) {
                await FileUtils.ensureDirectoryExists(this.diffDir);
                diffImagePath = path.join(this.diffDir, `${FileUtils.sanitizeFileName(testName)}_diff.png`);
                const diffBuffer = PNG.sync.write(diff);
                await fs.writeFile(diffImagePath, diffBuffer);
            }

            return {
                isMatch,
                diffPixels,
                totalPixels,
                diffPercentage,
                diffImagePath
            };
        } catch (error) {
            throw new Error(`Screenshot comparison failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export class Logger {
    private static formatMessage(level: string, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }

    static info(message: string): void {
        console.log(this.formatMessage('info', message));
    }

    static warn(message: string): void {
        console.warn(this.formatMessage('warn', message));
    }

    static error(message: string, error?: Error): void {
        const errorMessage = error ? `${message}: ${error.message}` : message;
        console.error(this.formatMessage('error', errorMessage));
    }

    static debug(message: string): void {
        if (process.env.DEBUG === 'true') {
            console.log(this.formatMessage('debug', message));
        }
    }
}