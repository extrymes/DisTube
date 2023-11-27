import type ytdl from "@distube/ytdl-core";
import type {
  Guild,
  GuildMember,
  GuildTextBasedChannel,
  Interaction,
  Message,
  Snowflake,
  VoiceBasedChannel,
  VoiceState,
} from "discord.js";
import type { CustomPlugin, DisTubeVoice, ExtractorPlugin, Playlist, Queue, SearchResult, Song } from ".";
import type { Cookie } from "@distube/ytdl-core";

export type Awaitable<T = any> = T | PromiseLike<T>;

export type DisTubeVoiceEvents = {
  disconnect: (error?: Error) => Awaitable;
  error: (error: Error) => Awaitable;
  finish: () => Awaitable;
};

export type DisTubeEvents = {
  error: [channel: GuildTextBasedChannel | undefined, error: Error];
  addList: [queue: Queue, playlist: Playlist];
  addSong: [queue: Queue, song: Song];
  playSong: [queue: Queue, song: Song];
  finishSong: [queue: Queue, song: Song];
  empty: [queue: Queue];
  finish: [queue: Queue];
  initQueue: [queue: Queue];
  noRelated: [queue: Queue];
  disconnect: [queue: Queue];
  deleteQueue: [queue: Queue];
  searchCancel: [message: Message<true>, query: string];
  searchNoResult: [message: Message<true>, query: string];
  searchDone: [message: Message<true>, answer: Message<true>, query: string];
  searchInvalidAnswer: [message: Message<true>, answer: Message<true>, query: string];
  searchResult: [message: Message<true>, results: SearchResult[], query: string];
};

export type TypedDisTubeEvents = {
  [K in keyof DisTubeEvents]: (...args: DisTubeEvents[K]) => Awaitable;
};

/**
 * An FFmpeg audio filter object
 * ```
 * {
 *   name:  "bassboost",
 *   value: "bass=g=10"
 * }
 * ```
 * @typedef {Object} Filter
 * @prop {string} name Name of the filter
 * @prop {string} value FFmpeg audio filter(s)
 */
export interface Filter {
  name: string;
  value: string;
}

/**
 * Data that resolves to give an FFmpeg audio filter. This can be:
 * - A name of a default filters or custom filters (`string`)
 * - A {@link Filter} object
 * @typedef {string|Filter} FilterResolvable
 * @see {@link defaultFilters}
 * @see {@link DisTubeOptions|DisTubeOptions.customFilters}
 */
export type FilterResolvable = string | Filter;

/**
 * FFmpeg Filters
 * ```
 * {
 *   "Filter Name": "Filter Value",
 *   "bassboost":   "bass=g=10"
 * }
 * ```
 * @typedef {Object.<string, string>} Filters
 * @see {@link defaultFilters}
 */
export type Filters = Record<string, string>;

/**
 * DisTube options.
 * @typedef {Object} DisTubeOptions
 * @prop {Array<CustomPlugin|ExtractorPlugin>} [plugins] DisTube plugins.
 * @prop {boolean} [emitNewSongOnly=false] Whether or not emitting {@link DisTube#event:playSong} event
 * when looping a song or next song is the same as the previous one
 * @prop {boolean} [leaveOnEmpty=true] Whether or not leaving voice channel
 * if the voice channel is empty after {@link DisTubeOptions}.emptyCooldown seconds.
 * @prop {boolean} [leaveOnFinish=false] Whether or not leaving voice channel when the queue ends.
 * @prop {boolean} [leaveOnStop=true] Whether or not leaving voice channel after using {@link DisTube#stop} function.
 * @prop {boolean} [savePreviousSongs=true] Whether or not saving the previous songs of the queue
 * and enable {@link DisTube#previous} method
 * @prop {number} [searchSongs=0] Limit of search results emits in {@link DisTube#event:searchResult} event
 * when {@link DisTube#play} method executed. If `searchSongs <= 1`, play the first result
 * @prop {Cookie[]|string} [youtubeCookie] YouTube cookies. Guide: {@link https://distube.js.org/#/docs/DisTube/main/general/cookie YouTube Cookies}
 * @prop {Filters} [customFilters] Override {@link defaultFilters} or add more ffmpeg filters.
 * @prop {ytdl.getInfoOptions} [ytdlOptions] `ytdl-core` get info options
 * @prop {number} [searchCooldown=60] Built-in search cooldown in seconds (When searchSongs is bigger than 0)
 * @prop {number} [emptyCooldown=60] Built-in leave on empty cooldown in seconds
 * @prop {boolean} [nsfw=false] Whether or not playing age-restricted content
 * and disabling safe search in non-NSFW channel.
 * @prop {boolean} [emitAddListWhenCreatingQueue=true] Whether or not emitting `addList` event when creating a new Queue
 * @prop {boolean} [emitAddSongWhenCreatingQueue=true] Whether or not emitting `addSong` event when creating a new Queue
 * @prop {boolean} [joinNewVoiceChannel=true] Whether or not joining the new voice channel
 * when using {@link DisTube#play} method
 * @prop {StreamType} [streamType=StreamType.OPUS] Decide the {@link DisTubeStream#type} will be used
 * (Not the same as {@link DisTubeStream#type})
 * @prop {boolean} [directLink=true] Whether or not playing a song with direct link
 */
export type DisTubeOptions = {
  plugins?: (CustomPlugin | ExtractorPlugin)[];
  emitNewSongOnly?: boolean;
  leaveOnFinish?: boolean;
  leaveOnStop?: boolean;
  leaveOnEmpty?: boolean;
  emptyCooldown?: number;
  savePreviousSongs?: boolean;
  searchSongs?: number;
  searchCooldown?: number;
  youtubeCookie?: Cookie[] | string;
  customFilters?: Filters;
  ytdlOptions?: ytdl.downloadOptions;
  nsfw?: boolean;
  emitAddSongWhenCreatingQueue?: boolean;
  emitAddListWhenCreatingQueue?: boolean;
  joinNewVoiceChannel?: boolean;
  streamType?: StreamType;
  directLink?: boolean;
};

/**
 * Data that can be resolved to give a guild id string. This can be:
 * - A guild id string | a guild {@link https://discord.js.org/#/docs/main/stable/class/Snowflake|Snowflake}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/Guild|Guild}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/Message|Message}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/BaseGuildVoiceChannel|BaseGuildVoiceChannel}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/BaseGuildTextChannel|BaseGuildTextChannel}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/VoiceState|VoiceState}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/GuildMember|GuildMember}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/Interaction|Interaction}
 * - A {@link DisTubeVoice}
 * - A {@link Queue}
 * @typedef {
 * Discord.Snowflake|
 * Discord.Guild|
 * Discord.Message|
 * Discord.BaseGuildVoiceChannel|
 * Discord.BaseGuildTextChannel|
 * Discord.VoiceState|
 * Discord.GuildMember|
 * Discord.Interaction|
 * DisTubeVoice|
 * Queue|
 * string
 * } GuildIdResolvable
 */
export type GuildIdResolvable =
  | Queue
  | DisTubeVoice
  | Snowflake
  | Message
  | GuildTextBasedChannel
  | VoiceBasedChannel
  | VoiceState
  | Guild
  | GuildMember
  | Interaction
  | string;

export interface OtherSongInfo {
  src: string;
  id?: string;
  title?: string;
  name?: string;
  is_live?: boolean;
  isLive?: boolean;
  _duration_raw?: string | number;
  duration?: string | number;
  webpage_url?: string;
  url: string;
  thumbnail?: string;
  related?: RelatedSong[];
  view_count?: string | number;
  views?: string | number;
  like_count?: string | number;
  likes?: string | number;
  dislike_count?: string | number;
  dislikes?: string | number;
  repost_count?: string | number;
  reposts?: string | number;
  uploader?: string | { name: string; url: string };
  uploader_url?: string;
  age_limit?: string | number;
  chapters?: Chapter[];
  age_restricted?: boolean;
}

export interface Chapter {
  title: string;
  start_time: number;
}

export interface PlaylistInfo {
  source: string;
  member?: GuildMember;
  songs: Song[];
  name?: string;
  url?: string;
  thumbnail?: string;
  /** @deprecated */
  title?: string;
  /** @deprecated */
  webpage_url?: string;
}

export type RelatedSong = Omit<Song, "related">;

/**
 * @typedef {Object} PlayHandlerOptions
 * @prop {Discord.BaseGuildTextChannel} [options.textChannel] The default text channel of the queue
 * @prop {boolean} [options.skip=false] Skip the playing song (if exists) and play the added playlist instantly
 * @prop {number} [options.position=0] Position of the song/playlist to add to the queue,
 * <= 0 to add to the end of the queue.
 */
export type PlayHandlerOptions = {
  skip?: boolean;
  position?: number;
  textChannel?: GuildTextBasedChannel;
};

/**
 * @typedef {Object} PlayOptions
 * @prop {Discord.GuildMember} [member] Requested user (default is your bot)
 * @prop {Discord.BaseGuildTextChannel} [textChannel] Default {@link Queue#textChannel}
 * @prop {boolean} [skip=false]
 * Skip the playing song (if exists) and play the added song/playlist if `position` is 1.
 * If `position` is defined and not equal to 1, it will skip to the next song instead of the added song
 * @prop {number} [position=0] Position of the song/playlist to add to the queue,
 * <= 0 to add to the end of the queue.
 * @prop {Discord.Message} [message] Called message (For built-in search events. If this is a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy|falsy value}, it will play the first result instead)
 * @prop {*} [metadata] Optional metadata that can be attached to the song/playlist will be played,
 * This is useful for identification purposes when the song/playlist is passed around in events.
 * See {@link Song#metadata} or {@link Playlist#metadata}
 */
export interface PlayOptions extends PlayHandlerOptions, ResolveOptions<any> {
  message?: Message;
}

/**
 * @typedef {Object} ResolveOptions
 * @prop {Discord.GuildMember} [member] Requested user
 * @prop {*} [metadata] Metadata
 */
export interface ResolveOptions<T = unknown> {
  member?: GuildMember;
  metadata?: T;
}

/**
 * @typedef {ResolveOptions} ResolvePlaylistOptions
 * @prop {string} [source] Source of the playlist
 */
export interface ResolvePlaylistOptions<T = unknown> extends ResolveOptions<T> {
  source?: string;
}

/**
 * @typedef {Object} CustomPlaylistOptions
 * @prop {Discord.GuildMember} [member] A guild member creating the playlist
 * @prop {Object} [properties] Additional properties such as `name`
 * @prop {boolean} [parallel=true] Whether or not fetch the songs in parallel
 * @prop {*} [metadata] Metadata
 */
export interface CustomPlaylistOptions {
  member?: GuildMember;
  properties?: Record<string, any>;
  parallel?: boolean;
  metadata?: any;
}

/**
 * The repeat mode of a {@link Queue}
 * * `DISABLED` = 0
 * * `SONG` = 1
 * * `QUEUE` = 2
 * @typedef {number} RepeatMode
 */
export enum RepeatMode {
  DISABLED,
  SONG,
  QUEUE,
}

/**
 * All available plugin types:
 * * `CUSTOM` = `"custom"`: {@link CustomPlugin}
 * * `EXTRACTOR` = `"extractor"`: {@link ExtractorPlugin}
 * @typedef {"custom"|"extractor"} PluginType
 */
export enum PluginType {
  CUSTOM = "custom",
  EXTRACTOR = "extractor",
}

/**
 * Search result types:
 * * `VIDEO` = `"video"`
 * * `PLAYLIST` = `"playlist"`
 * @typedef {"video"|"playlist"} SearchResultType
 */
export enum SearchResultType {
  VIDEO = "video",
  PLAYLIST = "playlist",
}

/**
 * Stream types:
 * * `OPUS` = `0` (Better quality, use more resources - **Recommended**)
 * * `RAW` = `1` (Better performance, use less resources)
 * @typedef {number} StreamType
 * @type {StreamType}
 */
export enum StreamType {
  OPUS,
  RAW,
}

/**
 * @typedef {Object} Events
 * @prop {string} ERROR error
 * @prop {string} ADD_LIST addList
 * @prop {string} ADD_SONG addSong
 * @prop {string} PLAY_SONG playSong
 * @prop {string} FINISH_SONG finishSong
 * @prop {string} EMPTY empty
 * @prop {string} FINISH finish
 * @prop {string} INIT_QUEUE initQueue
 * @prop {string} NO_RELATED noRelated
 * @prop {string} DISCONNECT disconnect
 * @prop {string} DELETE_QUEUE deleteQueue
 * @prop {string} SEARCH_CANCEL searchCancel
 * @prop {string} SEARCH_NO_RESULT searchNoResult
 * @prop {string} SEARCH_DONE searchDone
 * @prop {string} SEARCH_INVALID_ANSWER searchInvalidAnswer
 * @prop {string} SEARCH_RESULT searchResult
 */
export enum Events {
  ERROR = "error",
  ADD_LIST = "addList",
  ADD_SONG = "addSong",
  PLAY_SONG = "playSong",
  FINISH_SONG = "finishSong",
  EMPTY = "empty",
  FINISH = "finish",
  INIT_QUEUE = "initQueue",
  NO_RELATED = "noRelated",
  DISCONNECT = "disconnect",
  DELETE_QUEUE = "deleteQueue",
  SEARCH_CANCEL = "searchCancel",
  SEARCH_NO_RESULT = "searchNoResult",
  SEARCH_DONE = "searchDone",
  SEARCH_INVALID_ANSWER = "searchInvalidAnswer",
  SEARCH_RESULT = "searchResult",
}
