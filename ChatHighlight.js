// =================================================================
// Plugin Information
// =================================================================
const PLUGIN = {
    name: "Chat Highlight",
    version: "1.0.0",
    author: "Fanconma",
    latestConfVer: 1,
};

// Define constants for plugin paths to improve readability and maintenance.
const CONFIG_PATH = `.\\Plugins\\ChatHighlight\\`;
const LANG_PATH = `.\\Plugins\\ChatHighlight\\lang\\`;

// =================================================================
// Configuration Files
// =================================================================
// Initialize the main configuration file.
let Config = new JsonConfigFile(CONFIG_PATH + "config.json", JSON.stringify({
    config_version: PLUGIN.latestConfVer,
    lang: "en_US",
    command_registration: true,
    enable_chat_highlight: true,
    selfname_as_highlight: true,
    keywords: ["thisisakeyword", "anotherkeyword"],
    mention_sound: "note.bell"
}));

// Initialize the player data storage file.
let Data = new JsonConfigFile(CONFIG_PATH + "player_data.json", JSON.stringify({}));

// =================================================================
// Internationalization (i18n) Setup
// =================================================================
// Load translations directly from a JSON object.
// This method embeds the language strings within the script,
// simplifying distribution by avoiding external .json files.
// The third argument is a map of language codes to their translation objects.
i18n.load(LANG_PATH + "language.json", "", {
    "zh_CN":
    {
        "command.description": "高亮聊天中的特定关键词",
        "command.success.add": "关键词 “{0}” 已添加。",
        "command.success.remove": "关键词 “{0}” 已移除。",
        "command.success.remove_all": "已移除所有关键词。",
        "command.error.notExist": "关键词 “{0}” 不存在。",
        "command.list.header": "§r===============\n当前关键词:\n ",
        "command.list.footer": "\n§r===============",
        "command.list.empty": "无",
        "command.help.message": "§r===============\n用法:\n/hl add <关键词> - 添加高亮词\n/hl remove <关键词> - 移除高亮词\n/hl removeAll - 移除所有高亮词\n/hl list - 查看所有高亮词\n/hl help - 显示此帮助信息\n===============",
        "plugin.default.message": "{0}\n作者: {1}\n版本: {2}",
        "log.init.start": "未找到玩家 {0} ({1}) 的数据，正在初始化...",
        "log.init.success": "玩家 {0} ({1}) 的数据初始化完成。",
        "log.cmd.disabled": "配置文件中已禁用指令注册。"
    },
    "en_US":
    {
        "command.description": "Highlight specific keywords in chat",
        "command.success.add": "Keyword \"{0}\" has been added.",
        "command.success.remove": "Keyword \"{0}\" has been removed.",
        "command.success.remove_all": "All keywords have been removed.",
        "command.error.notExist": "Keyword \"{0}\" does not exist.",
        "command.list.header": "§r===============\nCurrent keywords:\n ",
        "command.list.footer": "\n§r===============",
        "command.list.empty": "None",
        "command.help.message": "===============\nUsage:\n/hl add <keyword> - Add a keyword\n/hl remove <keyword> - Remove a keyword\n/hl removeAll - Remove all keywords\n/hl list - List all keywords\n/hl help - Show this help message\n===============",
        "plugin.default.message": "{0}\nBy {1}\nVersion: {2}",
        "log.init.start": "Did not find player data for {0} ({1}), initializing...",
        "log.init.success": "Player data for {0} ({1}) initialized.",
        "log.cmd.disabled": "Command registration is disabled in the configuration."
    }
});

// =================================================================
// Data Handling Functions
// These functions provide a structured way to interact with player data.
// =================================================================
function PDataGet(xuid) { return Data.get(xuid, []); }
function PDataWriteOne(xuid, data) { let d = PDataGet(xuid); d.push(data); Data.set(xuid, d); return true; }
function PDataInitialize(xuid) { Data.set(xuid, []); }
function PDataRemove(xuid, data) { let d = PDataGet(xuid); const i = d.indexOf(data); if (i > -1) { d.splice(i, 1); Data.set(xuid, d); return true; } return false; }
function PDataRemoveAll(xuid) { Data.set(xuid, []); return true; }

// =================================================================
// Packet Sending Functions
// =================================================================
/**
 * Plays a sound for a specific player by sending a packet directly.
 * @param {Player} player The player object to send the packet to.
 * @param {string} soundName The name of the sound to play (e.g., "note.bell").
 * @param {FloatPos} position The position in the world to play the sound at.
 * @param {number} volume The volume of the sound (default: 1.0).
 * @param {number} pitch The pitch of the sound (default: 1.0).
 */
function playSoundPacket(player, soundName, position, volume = 1.0, pitch = 1.0) {
    const bs = new BinaryStream();
    bs.writeString(soundName);

    // Position is multiplied by 8 for the packet protocol.
    bs.writeVarInt(Math.round(position.x * 8));
    bs.writeUnsignedVarInt(Math.round(position.y * 8));
    bs.writeVarInt(Math.round(position.z * 8));

    bs.writeFloat(volume);
    bs.writeFloat(pitch);

    // Create a packet with ID 86 (PlaySoundPacket)
    const pkt = bs.createPacket(86);
    player.sendPacket(pkt);
}

// =================================================================
// Command Registration
// =================================================================
function regCmd() {
    // Create the base command.
    let cmd = mc.newCommand("highlight", i18n.trl(Config.get("lang","en_US"), "command.description"), PermType.Any);
    cmd.setAlias("hl");
    cmd.setAlias("高亮"); // Alias for Chinese users

    // Setup a SoftEnum that will be dynamically populated with player keywords.
    cmd.setSoftEnum("keywordList", []);

    // Sub-command: add
    cmd.setEnum("addKeyword", ["add"]);
    cmd.mandatory("action", ParamType.Enum, "addKeyword", 1);
    cmd.mandatory("addKeywordName", ParamType.RawText);
    cmd.overload(["addKeyword", "addKeywordName"]);

    // Sub-command: remove
    cmd.setEnum("removeKeyword", ["remove"]);
    cmd.mandatory("action", ParamType.Enum, "removeKeyword", 1);
    cmd.mandatory("removeKeywordName", ParamType.SoftEnum, "keywordList");
    cmd.overload(["removeKeyword", "removeKeywordName"]);

    // Sub-command: removeAll
    cmd.setEnum("removeAllKeyword", ["removeAll"]);
    cmd.mandatory("action", ParamType.Enum, "removeAllKeyword");
    cmd.overload(["removeAllKeyword"]);

    // Sub-command: list
    cmd.setEnum("listKeyword", ["list"]);
    cmd.mandatory("action", ParamType.Enum, "listKeyword", 1);
    cmd.overload(["listKeyword"]);

    // Sub-command: help
    cmd.setEnum("helpKeyword", ["help"]);
    cmd.mandatory("action", ParamType.Enum, "helpKeyword", 1);
    cmd.overload(["helpKeyword"]);
    cmd.overload([]); // Default overload (e.g., /hl)

    // Set the callback function to handle command execution.
    cmd.setCallback((_cmd, _ori, out, res) => {
        const playerXuid = _ori.player.xuid;
        const playerKeywords = PDataGet(playerXuid);

        // Dynamically update the SoftEnum with the current player's keywords for tab-completion.
        _cmd.setSoftEnum("keywordList", playerKeywords);

        switch (res.action) {
            case "add":
                PDataWriteOne(playerXuid, res.addKeywordName);
                out.success(i18n.trl(Config.get("lang","en_US"), "command.success.add", res.addKeywordName));
                break;
            case "remove":
                if (!playerKeywords.includes(res.removeKeywordName)) {
                    out.error(i18n.trl(Config.get("lang","en_US"), "command.error.notExist", res.removeKeywordName));
                    return;
                }
                PDataRemove(playerXuid, res.removeKeywordName);
                out.success(i18n.trl(Config.get("lang","en_US"), "command.success.remove", res.removeKeywordName));
                break;
            case "remove_all":
                PDataRemoveAll(playerXuid);
                out.success(i18n.trl(Config.get("lang","en_US"), "command.success.removeAll"));
                break;
            case "list":
                const keywordsString = playerKeywords.length > 0 ? playerKeywords.join("§r, §a") : i18n.trl(Config.get("lang","en_US"), "command.list.empty");
                out.addMessage(i18n.trl(Config.get("lang","en_US"), "command.list.header") + "§a" + keywordsString + i18n.trl(Config.get("lang","en_US"), "command.list.footer"));
                break;
            case "help":
                out.addMessage(i18n.trl(Config.get("lang","en_US"), "command.help.message"));
                break;
            default: // Runs when the command is executed with no arguments
                out.addMessage(i18n.trl(Config.get("lang","en_US"), "plugin.default.message", PLUGIN.name, PLUGIN.author, PLUGIN.version));
                break;
        }
    });
    cmd.setup();
}

// =================================================================
// Event Listeners
// =================================================================
// Listen for chat messages to perform highlighting.
mc.listen("onChat", (sender, msg) => {
    if (!Config.get("enable_chat_highlight", true)) return true;

    const onlinePlayers = mc.getOnlinePlayers();
    const globalKeywords = Config.get("keywords", []);
    const mentionSound = Config.get("mention_sound", "note.bell");
    const highlightSelf = Config.get("selfname_as_highlight", true);
    const playersToHighlight = new Map(); // Stores which players to notify and with which keywords.

    // Determine which players need to be notified.
    for (const targetPlayer of onlinePlayers) {
        let personalKeywords = PDataGet(targetPlayer.xuid);
        let allKeywords = [...personalKeywords, ...globalKeywords];
        if (highlightSelf) allKeywords.push(targetPlayer.name);

        const uniqueKeywords = [...new Set(allKeywords)];
        let matchedKeywords = [];

        for (const keyword of uniqueKeywords) {
            if (msg.toLowerCase().includes(keyword.toLowerCase())) {
                matchedKeywords.push(keyword);
            }
        }

        if (matchedKeywords.length > 0) {
            playersToHighlight.set(targetPlayer.xuid, matchedKeywords);
        }
    }

    if (playersToHighlight.size === 0) return true; // No highlights needed, process chat normally.

    // Re-send the chat message with custom highlighting for affected players.
    const messagePrefix = `§r<${sender.name}>§r `;
    for (const player of onlinePlayers) {
        if (playersToHighlight.has(player.xuid)) {
            let highlightedMsg = msg;
            const keywords = playersToHighlight.get(player.xuid);

            for (const keyword of keywords) {
                // Escape special regex characters in the keyword.
                const regex = new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "gi");
                // Replace matched keyword with a highlighted version.
                highlightedMsg = highlightedMsg.replace(regex, `§e§l$&§r`);
            }
            player.tell(messagePrefix + highlightedMsg);

            // Play a notification sound if configured.
            if (mentionSound) {
                playSoundPacket(player, mentionSound, player.pos);
            }
        } else {
            // Send the original message to other players.
            player.tell(messagePrefix + msg);
        }
    }
    return false; // Cancel the original chat message event to avoid duplicates.
});

// Register commands when the server has started.
mc.listen("onServerStarted", () => {
    if (Config.get("command_registration")) {
        regCmd();
    } else {
        logger.info(i18n.trl(Config.get("lang","en_US"), "log.cmd.disabled"));
    }
});

// Initialize player data upon their first join.
mc.listen("onJoin", (player) => {
    if (Data.get(player.xuid, null) == null) {
        logger.info(i18n.trl(Config.get("lang","en_US"), "log.init.start", player.name, player.xuid));
        PDataInitialize(player.xuid);
        logger.info(i18n.trl(Config.get("lang","en_US"), "log.init.success", player.name, player.xuid));
    }
});

// =================================================================
// Plugin Initialization
// =================================================================
// Displays a fancy logo in the console on startup.
function consoleInfo() {
    const logo = [
        "",
        ".___________. __  .___________. __       _______  __    __   __    _______  __    __   __       __    _______  __    __  .___________.",
        "|           ||  | |           ||  |     |   ____||  |  |  | |  |  /  _____||  |  |  | |  |     |  |  /  _____||  |  |  | |           |",
        "`---|  |----`|  | `---|  |----`|  |     |  |__   |  |__|  | |  | |  |  __  |  |__|  | |  |     |  | |  |  __  |  |__|  | `---|  |----`",
        "    |  |     |  |     |  |     |  |     |   __|  |   __   | |  | |  | |_ | |   __   | |  |     |  | |  | |_ | |   __   |     |  |     ",
        "    |  |     |  |     |  |     |  `----.|  |____ |  |  |  | |  | |  |__| | |  |  |  | |  `----.|  | |  |__| | |  |  |  |     |  |     ",
        "    |__|     |__|     |__|     |_______||_______||__|  |__| |__|  \\______| |__|  |__| |_______||__|  \\______| |__|  |__|     |__|     ",
        "",
        `                                      Version: ${PLUGIN.version}`,
        `                                      Author: ${PLUGIN.author}`,
        "",
    ].join("\n");
    logger.log(logo);
}

// Set the logger title for easy identification in the console.
logger.setTitle("Chat Highlight");
// Run the startup sequence.
consoleInfo();