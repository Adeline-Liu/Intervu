This contains some critical issues fixed during backend development:

1. Setting up EC2 instance
    requires AWS CLI command to push backend files from local -> S3 -> EC2
    requires AWS CLI setup both locally and on EC2
    locally ensures I AM rule contains full access to S3 service

2. Default network setting 
    EC2 under Security add inbound rule to allow ports on your EC2 instance from any IP address (0.0.0.0/0), using the TCP protocol
    one EC2 windows remotely, modify firewall configuration as following
        - find Windows Defender Firewall
        - Create new Inbound Rule:
            Rule Type: Select Port and click Next
            Protocol and Ports: Select TCP
            local ports field: enter port 5000
            Click Next -> Allow Domain, Private and Public

3. Setting up SSL certificate of the remote server auth.fga.dev
    on EC2 instance before everytime server runs
    Python uses the certifi package to provide a trusted set of certificates
    we make SSL_CERT_FILE environment variable to point to certifi's cacert.pem file
        - run python   
            import certifi
            print(certifi.where())
        - exit python 
            set SSL_CERT_FILE=C:\path\to\certifi\cacert.pem

4. Ensure I AM user has full access to openSearch service
    Get the AWS Access Key ID and AWS Secret Access Key from I AM info
    With AWS configure, configure the following accordingly:
        - AWS Access Key ID: (input Access Key ID)
        - AWS Secret Access Key: (input Secret Access Key)
        - Default region name [us-east-1]: (use us-east-1)
        - Default output format [json]: (use json)

5. Ensure all the required library are installed
    run pip install -r requirements.txt

6. Fix Cors in FastAPI
    with each request from different origin, usually the request header is checked to see if it includes Cors header to grant permission
    add the following:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],  # Allow all origins 
            allow_credentials=True,
            allow_methods=["*"],  # Allow all HTTP methods
            allow_headers=["*"],  # Allow all headers
        )
