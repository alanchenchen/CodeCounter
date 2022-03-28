package count

import (
	"strings"
)

// slice some with，判断s里面是否存在某项，由withFn完全匹配，v支持string类型，是s的子项
func stringSome(s []string, withFn func(v string) bool) bool {
	isInclueded := false
	for _, val := range s {
		isInclueded = withFn(val)
		if isInclueded {
			break
		}
	}
	return isInclueded
}

// slice includes with，判断s里面是否存在r，完全匹配，目前支持 string类型
func stringIncludes(s []string, r string) bool {
	return stringSome(s, func(v string) bool {
		return strings.Compare(v, r) == 0
	})
}
