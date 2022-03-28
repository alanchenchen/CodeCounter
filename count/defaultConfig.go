package count

// 块注释
type blockComment struct {
	start string
	end   string
}

// 注释规则
type CommentRule struct {
	row   string
	block blockComment
}

// 新建文件注释规则
func NewCommentRule(row, blockStart, blockEnd string) CommentRule {
	return CommentRule{
		row:   row,
		block: blockComment{blockStart, blockEnd},
	}
}

// 默认的文件注释规则map
var DefaultRuleConfig = make(map[string][]CommentRule)

// 默认过滤的文件(目录)slice
var ExcludePaths = []string{
	"node_modules",
	".git",
	".gitignore",
	".npmignore",
}

// 初始化文件的默认注释规则 DefaultRuleConfig
func init() {
	DefaultRuleConfig["js"] = []CommentRule{
		{
			row: "//", block: blockComment{start: "/*", end: "*/"},
		},
	}

	DefaultRuleConfig["ts"] = []CommentRule{
		{
			row: "//", block: blockComment{start: "/*", end: "*/"},
		},
	}

	DefaultRuleConfig["go"] = []CommentRule{
		{
			row: "//", block: blockComment{start: "/*", end: "*/"},
		},
	}

	DefaultRuleConfig["jsx"] = []CommentRule{
		{
			row: "//", block: blockComment{start: "/*", end: "*/"},
		},
	}

	DefaultRuleConfig["tsx"] = []CommentRule{
		{
			row: "//", block: blockComment{start: "/*", end: "*/"},
		},
	}

	DefaultRuleConfig["vue"] = []CommentRule{
		{
			row: "//", block: blockComment{start: "/*", end: "*/"},
		},
		{
			block: blockComment{start: "<!--", end: "-->"},
		},
	}

	DefaultRuleConfig["svelte"] = []CommentRule{
		{
			row: "//", block: blockComment{start: "/*", end: "*/"},
		},
		{
			block: blockComment{start: "<!--", end: "-->"},
		},
	}

	DefaultRuleConfig["html"] = []CommentRule{
		{
			block: blockComment{start: "<!--", end: "-->"},
		},
	}

	DefaultRuleConfig["css"] = []CommentRule{
		{
			block: blockComment{start: "/*", end: "*/"},
		},
	}

	DefaultRuleConfig["java"] = []CommentRule{
		{
			row: "//", block: blockComment{start: "/*", end: "*/"},
		},
	}

	DefaultRuleConfig["c"] = []CommentRule{
		{
			row: "//", block: blockComment{start: "/*", end: "*/"},
		},
	}

	DefaultRuleConfig["cpp"] = []CommentRule{
		{
			row: "//", block: blockComment{start: "/*", end: "*/"},
		},
	}
}
