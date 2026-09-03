export function containsSpaceInsensitive(haystack, needle) {
    haystack = haystack.replace(/\s+/g,'')
    needle = needle.replace(/\s+/g,'')
    // console.log(haystack)
    console.log(needle)

    return haystack.includes(needle);
}