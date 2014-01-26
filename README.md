## Research semantic of commit messages

List of scanned repos was extracted using [Github Archive](http://www.githubarchive.org/) through [Google BigQuery](https://bigquery.cloud.google.com/):

```sql
SELECT repository_name, count(repository_name) as pushes, repository_description, repository_url
FROM [githubarchive:github.timeline]
GROUP EACH BY repository_name, repository_description, repository_url
ORDER BY pushes DESC
LIMIT 100
```
