interface WordCount {
    word: string;
    count: number;
}

export function generateWordCloud(texts: string[]): WordCount[] {
    // 合并所有文本
    const combinedText = texts
        .filter(Boolean)  // 过滤掉 null 和空字符串
        .join(' ')
        .toLowerCase();

    // 1. 预处理文本
    const cleanText = combinedText
        // 移除 URLs
        .replace(/https?:\/\/[^\s]+/g, '')
        // 移除特殊字符，保留字母、数字和空格
        .replace(/[^a-z0-9\s]/g, ' ')
        // 替换多个空格为单个空格
        .replace(/\s+/g, ' ')
        .trim();

    // 2. 分词
    const words = cleanText.split(' ');

    // 3. 词频统计
    const wordMap = new Map<string, number>();

    for (const word of words) {
        // 忽略停用词和过短的词
        if (word.length < 3 || STOP_WORDS.has(word)) continue;

        // 更新词频
        wordMap.set(word, (wordMap.get(word) || 0) + 1);
    }

    // 4. 转换为数组并排序
    const sortedWords = Array.from(wordMap.entries())
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        // 只取前 50 个最常见的词
        .slice(0, 40);

    return sortedWords;
}

// 更新停用词列表
const STOP_WORDS = new Set([
    // 通用停用词
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
    'will', 'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when',
    'where', 'who', 'which', 'why', 'how', 'many', 'much', 'about', 'over',
    'through', 'between', 'after', 'under', 'more', 'most', 'such', 'no', 'nor',
    'not', 'only', 'own', 'same', 'than', 'too', 'very', 'some', 'any',

    // 代词
    'his', 'her', 'their', 'our', 'your', 'my', 'its', 'those', 'these', 'them',
    'him', 'she', 'he', 'we', 'you', 'i', 'me', 'us', 'am', 'themselves',
    'himself', 'herself', 'myself', 'yourself', 'itself',

    // 新闻相关的常见词
    'said', 'says', 'according', 'reported', 'told', 'reuters', 'afp', 'ap',
    'news', 'report', 'reports', 'article', 'update', 'updated', 'breaking',
    'exclusive', 'source', 'sources', 'official', 'officials', 'statement',
    'announced', 'revealed', 'confirmed', 'claimed', 'stated',

    // 特朗普和马斯克相关的基础词
    'trump', 'donald', 'musk', 'elon', 'former', 'president', 'ceo', 'billionaire',

    // 时间相关词
    'today', 'yesterday', 'tomorrow', 'week', 'weeks', 'month', 'year', 'day', 'night',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
    'september', 'october', 'november', 'december', 'daily', 'weekly', 'monthly',
    'annual', 'yearly', 'latest', 'recent', 'current', 'past', 'future',
    'earlier', 'later', 'soon', 'ago', 'previously', 'recently', 'currently',
    'immediately', 'instantly', 'moment', 'shortly', 'eventually', 'finally',
    'initially', 'originally', 'previously', 'subsequently',

    // 常见动词
    'say', 'says', 'said', 'would', 'could', 'should', 'may', 'might', 'must',
    'can', 'cannot', 'cant', 'will', 'wont', 'do', 'does', 'did', 'done',
    'make', 'makes', 'made', 'making', 'take', 'takes', 'took', 'taken',
    'get', 'gets', 'got', 'getting', 'go', 'goes', 'went', 'gone', 'going',
    'come', 'comes', 'came', 'coming', 'know', 'knows', 'knew', 'known',
    'think', 'thinks', 'thought', 'thinking',

    // 其他常见词
    'new', 'time', 'first', 'last', 'one', 'two', 'three', 'next', 'back',
    'also', 'after', 'before', 'now', 'still', 'just', 'while', 'since',
    'like', 'well', 'even', 'ever', 'never', 'always', 'often', 'sometimes',
    'usually', 'really', 'way', 'ways', 'thing', 'things', 'something',
    'nothing', 'everything', 'anything', 'someone', 'everyone', 'anyone',
    'nobody', 'everybody', 'anybody', 'somewhere', 'everywhere', 'anywhere',
    'many', 'much', 'several', 'few', 'little', 'lot', 'lots', 'plenty',
    'amid', 'among', 'during', 'within', 'without', 'despite', 'although',
    'however', 'whether', 'though', 'unless', 'until', 'while',

    // 数量和程度词
    'all', 'both', 'each', 'every', 'few', 'many', 'several', 'some',
    'various', 'enough', 'less', 'least', 'more', 'most', 'much', 'other',
    'others', 'another', 'either', 'neither', 'rather', 'quite', 'somewhat',
    'almost', 'about', 'around', 'nearly'
]); 