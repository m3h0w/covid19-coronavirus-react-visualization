npm run build
sam deploy `
    --template-file .aws-sam/build/template.yaml `
    --stack-name covid-19-data-synchronizer `
    --s3-bucket serverless-source-code-bucket `
    --s3-prefix covid-19-data-synchronizer `
    --region eu-west-1 `
    --profile private `
    --capabilities CAPABILITY_IAM `
    --no-fail-on-empty-changeset `
    --parameter-overrides ParameterKey=GithubAccessToken,ParameterValue=<your-github-access-token>