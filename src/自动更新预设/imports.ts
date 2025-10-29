import raw_preset_name from './名称.txt?raw';
import changelog_content from './更新日志.md';
import preset_content from './预设.json?raw';

export { changelog_content, preset_content };

export const preset_name = raw_preset_name.trim();
