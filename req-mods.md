# Modifications Needed
This is a list of things that need to be modified in order to get
the current application code (Lambdas, Backend, Frontend, etc.) to
work with the CDK deployment flow.

- Update Lambda `test-runner` to get the URL for the home region
  SQS from the `RESULTS_Q_URL` environment variable instead of being
  hard coded like it currently is.

- Update Lambda `test-route-packager` to add the `MessageAttributes`
  in a way that is accepted by the new filter policies on the subscriptions.
  The old way will not work for setting the policy in CDK. Fine, because
  this fits more with my way of how it should have worked originally.

- Set the environment variables that `tests-crud` needs:
  - DB info, from RDS CDK instance
  - ARN for eventbridge (create new rule)
  - ARN for `test-route-packager` (set as target for newly created test rules)

- 