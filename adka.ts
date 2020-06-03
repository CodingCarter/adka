/// <reference path="./jsx.d.ts" />

import { copy, exists } from 'https://deno.land/std/fs/mod.ts';

import { generatePages } from './generatePages/generatePages.ts';
import { config, paths } from './config.ts';
import { info } from './deps.ts';
import { watch } from './watcher.ts';

export async function adka() {
    info('Run adka');

    if (await exists(paths.distStatic)) {
        await Deno.remove(paths.distStatic, { recursive: true });
    }
    await copy(paths.srcAssets, paths.distAssets);
    if (await exists(paths.startScript)) {
        info('Execute start script.');
        const start = await import(`file://${paths.startScript}`);
        if (start?.default) {
            await start.default({ config, paths });
        }
    }
    await generatePages();
    await watch();
}

if (import.meta.main) {
    adka();
}
