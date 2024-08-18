#!/usr/bin/env node

import { Hono } from 'hono'
import open from 'open';
import fs from 'fs';
import { parseArgs } from 'util';
import { getHash } from './helper.mjs';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve } from '@hono/node-server';
const app = new Hono();
app.use('/*', serveStatic({
    root: './static/'
}))

serve({
    fetch: app.fetch,
}, async (info) =>{
    console.log('info:',info)
    console.log(`Server is running on port ${info.port}`)
    const args = process.argv.slice(1);
    const {positionals} = parseArgs({args,allowPositionals:true});
    console.log(positionals);
    let code_path= positionals.find(x => x.endsWith('.js'));
    let map_path = positionals.find(x => x.endsWith('.js.map'));
    
    if(!code_path || !map_path) {
        console.error('please pass .js and .js.map to cli');
        process.exit(1);
    }
    console.log('p',code_path, map_path);
    const code = fs.readFileSync(code_path, 'utf-8');
    const map = fs.readFileSync(map_path, 'utf-8');
    let hash = getHash(code,map);
    const url = `http://${info.address}:${info.port}/${hash}`;
    console.log(url);
    await open(url, {
        wait:true
    });
})
