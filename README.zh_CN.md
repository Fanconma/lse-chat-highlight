# Chat Highlight 聊天高亮
🌏 [English](https://github.com/Fanconma/lse-chat-highlight/blob/main/README.md) | 简体中文

一个简单的插件，用于在 LeviLamina（LSE 引擎）的聊天中突出显示特定关键字！
<img width="822" height="173" alt="image" src="https://github.com/user-attachments/assets/102f9e0b-ff34-4b1d-8906-3f0f8c8496c1" />



# 安装
您可以直接下载 `.js` 文件并将其放入 `plugins` 文件夹中。
或者，您也可以使用以下命令：
```
lip install github.com/Fanconma/lse-chat-highlight
```

# 使用
插件首次运行后，会在其目录中生成两个文件：`config.json` 和 `player_data.json`。

您可以编辑配置文件来定制您的体验。

## 指令:
- /highlight add \<keyword\> ：将关键词添加到您的高亮列表中。
- /highlight remove \<keyword\> ：从列表中删除现有关键词。
- /highlight remove_all ：删除所有关键词。
- /highlight list ：列出所有关键词。
- /highlight help ：显示帮助信息。
注意：这些命令仅影响您的个人关键词。全局关键词可以在 `config.json` 文件中进行管理。

如果另一个玩家的消息包含您的某个关键词，则该关键词将会突出显示，并且会播放声音来提醒您。:)

# `config.json`
```json
{
    // 配置文件版本。除非您知道自己在做什么，否则请勿更改此值。
    "config_version": 1,

    // 插件语言。可用语言：“en_US”、“zh_CN”。
    "lang": "en_US",

    // 允许玩家使用命令管理个人关键词。设置为 true 即可注册“/highlight”命令。设为 false 后玩家无法自行增加/删除个人提示词
    "command_registration": true,
    // 启用聊天中的关键字高亮显示。如果设置为 false，即使消息中包含关键字，也不会高亮显示。
    "enable_chat_highlight": true,

    // 如果为真，则玩家自己的用户名将自动被视为高亮关键字。
    "selfname_as_highlight": true,
    // 全局高亮关键词。如果消息中包含这些关键词，所有玩家都会被高亮显示。
    // 玩家无法使用命令移除这些关键词。
    "keywords": [
        "thisisakeyword",
        "anotherkeyword"
    ],
    // 关键字高亮时播放的声音。设置为空字符串 "" 可禁用该声音。
    "mention_sound": "note.bell"
}
```

# 贡献
欢迎随时开启issue来展开讨论！
另外，如果您想帮助将插件翻译成您的语言，请 fork 此代码库！;)
