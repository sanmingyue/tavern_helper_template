import { changelog_content, preset_content, preset_name } from './imports';

type Button = {
  name: string;
  function: (() => void) | (() => Promise<void>);
};

const import_preset: Button = {
  name: '导入预设',
  function: async () => {
    if (getPresetNames().includes(preset_name)) {
      return;
    }
    const result = await SillyTavern.callGenericPopup(changelog_content, SillyTavern.POPUP_TYPE.CONFIRM, '', {
      okButton: '导入',
      cancelButton: '取消',
      leftAlign: true,
    });
    if (result === SillyTavern.POPUP_RESULT.CANCELLED) {
      return;
    }
    const success = await importRawPreset(preset_name, preset_content);
    if (!success) {
      toastr.error('导入预设失败, 请刷新重试', '写卡助手');
      return;
    }
    loadPreset(preset_name);
    toastr.success(`导入预设 '${preset_name}' 成功`, '写卡助手');
  },
};

function register_buttons(buttons: Button[]) {
  buttons.forEach(button => {
    eventClearEvent(getButtonEvent(button.name));
    eventOn(getButtonEvent(button.name), button.function);
  });
  replaceScriptButtons(buttons.map(button => ({ name: button.name, visible: true })));
}

async function check_button_status(): Promise<Button[]> {
  if (!getPresetNames().includes(preset_name)) {
    return [import_preset];
  }
  return [];
}

async function change_buttons() {
  register_buttons(await check_button_status());
}

export async function init_buttons() {
  change_buttons();
  eventOn(tavern_events.SETTINGS_UPDATED, _.throttle(change_buttons, 1000, { trailing: false }));
}

$(() => init_buttons());
