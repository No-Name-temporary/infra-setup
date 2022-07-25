CREATE TABLE assertion_types (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  display_name text NOT NULL UNIQUE,
  supported BOOLEAN
);

CREATE TABLE http_methods (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  display_name text NOT NULL UNIQUE,
  supported BOOLEAN
);

CREATE TABLE comparison_types (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  display_name text NOT NULL UNIQUE,
  symbol text UNIQUE,
  supported BOOLEAN
); 

CREATE TABLE regions (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  display_name text NOT NULL UNIQUE,
  aws_name text NOT NULL UNIQUE,
  flag_url text NOT NULL,
  supported BOOLEAN
);

CREATE TABLE tests (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  run_frequency_mins INT NOT NULL,
  method_id INT 
    NOT NULL
    REFERENCES http_methods (id),
  url text NOT NULL,
  headers JSONB,
  payload JSONB,
  query_params JSONB,
  teardown text,
  status text NOT NULL,
  eb_rule_arn text,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE notification_settings (
  id serial PRIMARY KEY,
  alerts_on_recovery BOOLEAN NOT NULL,
  alerts_on_failure BOOLEAN NOT NULL
); 

CREATE TABLE alerts (
  id serial PRIMARY KEY,
  type text NOT NULL,
  destination text,
  notification_settings_id INT
    NOT NULL
    REFERENCES notification_settings (id)
    ON DELETE CASCADE
);

CREATE TABLE tests_alerts (
  id serial PRIMARY KEY,
  test_id INT
    NOT NULL
    REFERENCES tests (id)
    ON DELETE CASCADE,
  alerts_id INT
    NOT NULL
    REFERENCES alerts (id)
    ON DELETE CASCADE
);

CREATE TABLE test_runs (
  id serial PRIMARY KEY,
  test_id INT
    NOT NULL
    REFERENCES tests (id)
    ON DELETE CASCADE,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  pass BOOLEAN,
  region_id INT
    NOT NULL
    REFERENCES regions (id)
    ON DELETE CASCADE
); 

CREATE TABLE tests_regions (
  id serial PRIMARY KEY,
  test_id INT
    NOT NULL
    REFERENCES tests (id)
    ON DELETE CASCADE,
  region_id INT
    NOT NULL
    REFERENCES regions (id)
    ON DELETE CASCADE
); 

CREATE TABLE assertions (
  id serial PRIMARY KEY,
  test_id INT
    NOT NULL
    REFERENCES tests (id)
    ON DELETE CASCADE,
  type text NOT NULL,
  property text,
  comparison_type_id INT
    NOT NULL
    REFERENCES comparison_types (id)
    ON DELETE CASCADE,
  expected_value text
); 

CREATE TABLE assertion_results (
  id serial PRIMARY KEY,
  test_run_id INT
    NOT NULL
    REFERENCES test_runs (id)
    ON DELETE CASCADE,
  assertion_id INT
    NOT NULL
    REFERENCES assertions (id)
    ON DELETE CASCADE,
  actual_value text,
  pass BOOLEAN NOT NULL
); 

INSERT INTO assertion_types (id, name, display_name, supported) 
  VALUES (1, 'response_time', 'Response time', true),
         (2, 'status_code', 'Status code', true),
         (3, 'body', 'Body', true),
         (4, 'headers', 'Headers', true);

INSERT INTO http_methods (id, name, display_name, supported)
  VALUES (1, 'get', 'GET', true),
         (2, 'post', 'POST', true),
         (3, 'put', 'PUT', true),
         (4, 'delete', 'DELETE', true),
         (5, 'patch', 'PATCH', false),
         (6, 'head', 'HEAD', false);

INSERT INTO comparison_types (id, name, display_name, symbol, supported)
  VALUES (1, 'equal_to', 'Equal to', '=', true),
         (2, 'not_equal_to', 'Not equal to', '!=', true),
         (3, 'greater_than', 'Greater than', '>', true),
         (4, 'less_than', 'Less than', '<', true),
         (5, 'greater_than_or_equal_to', 'Greater than or equal to', '>=', true),
         (6, 'less_than_or_equal_to', 'Less than or equal to', '<=', true),
         (7, 'has_key', 'Has key', null, false),
         (8, 'not_has_key', 'Not has key', null, false),
         (9, 'has_value', 'Has value', null, false),
         (10, 'not_has_value', 'Not has value', null, false),
         (11, 'is_empty', 'Is empty', null, false),
         (12, 'is_not_empty', 'Is not empty', null, false),
         (13, 'contains', 'Contains', null, false),
         (14, 'not_contains', 'Not contains', null, false),
         (15, 'is_null', 'Is null', null, false),
         (16, 'is_not_null', 'Is not null', null, false);

INSERT INTO regions (id, name, display_name, aws_name, flag_url, supported)
  VALUES (1, 'us_east_1', 'N. Virginia', 'us-east-1','https://countryflagsapi.com/png/usa', true),
         (2, 'us_east_2','Ohio', 'us-east-2','https://countryflagsapi.com/png/usa', false),
         (3, 'us_west_1','N. California', 'us-west-1','https://countryflagsapi.com/png/usa', true),
         (4, 'us_west_2','Oregon', 'us-west-2','https://countryflagsapi.com/png/usa', false),
         (5, 'ca_central_1','Montreal', 'ca-central-1','https://countryflagsapi.com/png/canada', true),
         (6, 'sa_east_1','São Paulo', 'sa-east-1','https://countryflagsapi.com/png/brazil', false),
         (7, 'eu_north_1','Stockholm', 'eu-north-1','https://countryflagsapi.com/png/sweden', true),
         (8, 'eu_west_3','Paris', 'eu-west-3','https://countryflagsapi.com/png/france', false),
         (9, 'eu_west_2','London', 'eu-west-2','https://countryflagsapi.com/png/gbr', false),
         (10, 'eu_west_1','Ireland', 'eu-west-1','https://countryflagsapi.com/png/ireland', false),
         (11, 'eu_central_1','Frankfurt', 'eu-central-1','https://countryflagsapi.com/png/germany', false),
         (12, 'eu_south_1','Milan', 'eu-south-1','https://countryflagsapi.com/png/italy', false),
         (13, 'me_south_1','Bahrain', 'me-south-1','https://countryflagsapi.com/png/bahrain', false),
         (14, 'af_south_1','Cape Town', 'af-south-1','https://countryflagsapi.com/png/zaf', false),
         (15, 'ap_southeast_1','Singapore', 'ap-southeast-1','https://countryflagsapi.com/png/singapore', false),
         (16, 'ap_northeast_1','Tokyo', 'ap-northeast-1','https://countryflagsapi.com/png/japan', false),
         (17, 'ap_northeast_3','Osaka', 'ap-northeast-3','https://countryflagsapi.com/png/japan', false),
         (18, 'ap_east_1','Hong Kong', 'ap-east-1','https://countryflagsapi.com/png/china', false),
         (19, 'ap_southeast_2','Sydney', 'ap-southeast-2','https://countryflagsapi.com/png/australia', false),
         (20, 'ap_southeast_3','Jakarta', 'ap-southeast-3','https://countryflagsapi.com/png/indonesia', false),
         (21, 'ap_northeast_2','Seoul', 'ap-northeast-2','https://countryflagsapi.com/png/kor', false),
         (22, 'ap_south_1','Mumbai', 'ap-south-1','https://countryflagsapi.com/png/india', false);

INSERT INTO tests (id, name, run_frequency_mins, method_id, url, headers, payload, status, eb_rule_arn)
  VALUES (100000, 'first_get_test', 60, 1, 'https://trellific.corkboard.dev/api/boards','{}','{}', 'RUNNING', 'arn:imfake'),
         (100001,'first_post_test', 60, 2, 'https://trellific.corkboard.dev/api/boards', '{"Content-Type": "application/json"}', '{"board":{"title":"post-test-board"}}', 'RUNNING', 'arn:imfake');

INSERT INTO notification_settings (id, alerts_on_recovery, alerts_on_failure)
  VALUES (100000, false, true),
         (100001, true, true);

INSERT INTO alerts (id, type, destination, notification_settings_id)
  VALUES (100000, 'slack', 'https://hooks.slack.com/services/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', 100000),
  (100001, 'email', 'team.notspecial@gmail.com', 100000);

INSERT INTO tests_alerts (test_id, alerts_id)
  VALUES (100000,100000),
         (100000,100001),
         (100001,100001);

INSERT INTO assertions (id, test_id, type, property, comparison_type_id, expected_value)
  VALUES (100000, 100000, 'status_code', null, 1, '200'),
         (100001, 100000, 'response_time_ms', null, 4, '500'),
         (100002, 100001, 'status_code', null, 1, '201'),
         (100003, 100001, 'response_time_ms', null, 4, '600'),
         (100004, 100001, 'contains_property', null, 1, 'title'),
         (100005, 100001, 'contains_value','title', 1, 'my-test-board');
         
INSERT INTO tests_regions (test_id, region_id)
  VALUES (100000, 1),
         (100000, 2),
         (100000, 3),
         (100001, 1),
         (100001, 3);

INSERT INTO test_runs (id, test_id, started_at, completed_at, pass, region_id)
  VALUES (100000, 100000, NOW(), NOW(), true, 1),
         (100001, 100000, NOW(), NOW(), true, 2),
         (100002, 100000, NOW(), NOW(), true, 3),
         (100003, 100001, NOW(), NOW(), true, 1),
         (100004, 100001, NOW(), null, null, 3);

INSERT INTO assertion_results (id, test_run_id, assertion_id, actual_value, pass)
  VALUES (100000, 100000, 100000, '200', true),
         (100001, 100000, 100001, '237', true),
         (100002, 100001, 100000, '200', true),
         (100003, 100001, 100001, '423', true),
         (100004, 100002, 100000, '200', true),
         (100005, 100002, 100001, '96', true),
         (100006, 100003, 100002, '201', true),
         (100007, 100003, 100003, '598', true),
         (100008, 100003, 100004, 'title', true),
         (100009, 100003, 100005, 'my-test-board', true),
         (100010, 100004, 100002, '201', true),
         (100011, 100004, 100003, '329', true),
         (100012, 100004, 100004, 'title', true),
         (100013, 100004, 100005, 'my-test-board', true),
         (100014, 100004, 100004, null, true);