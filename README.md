About
========================================

When browsing a website that has multiple pages of results, this extension will
attempt to detect the next page and allow you to go to it with the following
keyboard shortcuts:

* `space` (only when at the bottom of the page)
* `n`

Algorithm
========================================

The next page is detected by the following methods in order:

1. From the first link that has the attribute `rel="next"`
2. From the first link that has a page parameter value greater than the current URL.
   For example, if the current url is `example.com/results&p=1`, the page parameter
   name would be `p`. The following parameter names are tried:

   * `p`
   * `page`
   * `pg`
   * `pid`
   * `start`

3. From the first link that has text that looks like "next". The following
   strings are tried:

   * `next`
   * `next page`
   * `older`
   * `>`
   * `›`

Notes
========================================

Due to how complicated it can be to detect the link to the next page for certain
websites, this add-on is only tested on websites I personally go to. Therefore
it is unlikely to be distributed through [Mozilla](https://addons.mozilla.org/)
at this point in time.
