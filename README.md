# urlShortner

/shorten - POST

curl --location --request POST 'localhost:3010/shorten' \
--header 'Content-Type: application/json' \
--data-raw '{
"url":"https://www.google.com"
}'

/:short_code - GET

curl --location --request GET 'localhost:3010/ec765c' \
--header 'Content-Type: application/json' \
--data-raw '{
"url":"https://www.google.com"
}'


/:short_code/stats - GET

curl --location --request GET 'localhost:3010/ec765c/stats' \
--header 'Content-Type: application/json' \
--data-raw '{
"url":"https://www.google.com"
}'
