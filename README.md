# Create a MySQL database on Red Hat Openshift on IBM Cloud and link it to your microservices application.

This tutorial can teach you how to create a MySQL instance on Red Hat OpenShift on IBM Cloud and integrate it to your microservices-based application, which is also deployed on Red Hat OpenShift.

Note: This tutorial assumes you already have a provisioned OpenShift cluster. You can provision your own cluster from here: [Red Hat OpenShift on IBM Cloud](https://cloud.ibm.com/kubernetes/catalog/about?platformType=openshift).


The tutorial is divided into 2 main parts:

1. **[Creating a new MySQL instance and adding data to the database](#creating-a-new-mysql-instance-and-adding-data-to-the-database)**
2. **[Deploying a microservices-based application and integrating it to our database](#deploying-a-microservices-based-application-and-integrating-it-to-our-database)**

# Creating a new MySQL instance and adding data to the database.
The first step is to create a new project using the command:

`oc new-project mysql-project`

or from the web console:
![alt text](https://github.com/MohameddSheriff/mysql-openshift/blob/master/images/Screenshot_2020-03-25%20OpenShift%20Web%20Console.png "Web console")


1. Next, it is time to create a MySQL instance from the web console by choosing **MySQL(Ephemeral)** from the catalog. 
Ephemeral basically means that the database is stateless, meaning all the data stored would be lost if the pod carrying the database is restarted/deleted. This is usually used for testing/development. The other option is to choose **MySQL** from the catalog which adds persistent volume storage to our project but it is out of scope of this tutorial.

2. After choosing MySQL(Ephemeral) from the catalog, enter a new *MySQL Connection Username*, *MySQL Connection Password*, and *MySQL root user Password*. These are the credentials that will be used to access the database later along with the *Database Service Name* and *MySQL Database Name*. The service takes around a minute to provision.
![alt text](https://github.com/MohameddSheriff/mysql-openshift/blob/master/images/Screen%20Shot%202020-03-25%20at%2011.42.50%20PM.png "service")

3. Now that we have our MySQL service ready. The next step is to populate the database. We will show you two ways to do that.

      * One way is to get into the actual pod that is carrying our deployment and populate the database using the *mysql* client. 
        - Go to your terminal and execute the following command:
            `oc get pods`
            Insert image here
        - Copy the name of the pod which contains mysql as shown above and execute this command: 
            `oc rsh <POD_NAME>`
        - Now that we are inside the pod, it is time to add some data to our database. Run `mysql -u  <ENTER_MYSQL_USERNAME> -p`
          ![alt text](https://github.com/MohameddSheriff/mysql-openshift/blob/master/images/Screen%20Shot%202020-03-26%20at%202.31.05%20AM.png "Pods")
        - once you are logged in, execute the following query to create a new table: 
        
        `USE sampledb; DROP TABLE IF EXISTS customer; CREATE TABLE IF NOT EXISTS customer ( id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, customerName VARCHAR( 255 ) NOT NULL, effectiveDate VARCHAR( 255 ), description TEXT, status VARCHAR( 255 ) NOT NULL );`
        - Then execute this to add data to the table: 
        
        
        `USE sampledb; INSERT INTO customer VALUES (1,'Testers Inc.','2020-04-01','Testers are who we hire to test our software','active'), (2,'Deployers CO','2019-06-01','Deployers co. deploy our software','active'), (3,'DJ John Doe','2019-12-01','John provides the music for our annual holiday party.',"active"), (4,'Doe Hypermarket','2019-06-05','Doe is where we purchase all food supply.',"active");`
        
        - To make sure everything is fine, run the following query and you should see the records you just entered: `select * from sampledb.customer;`
        
        - We are done here, type `exit` to quit from the *mysql* client and `exit` once more to exit the pod.
        
      * Another way to populate the database is by using a Database Management tool like *MySQL Workbench* on your host machine. This is done by forwarding the port in the pod that carries the mysql server to a port on your local machine.
        - Go to your terminal and execute the following command:
            `oc get pods`
           
        - Copy the name of the pod which contains mysql as shown above and execute this command: 
            `oc port-forward <POD_NAME> :3306`
            This will allocate a free port on your local machine to host the mysql server from the pod.
            ![alt text](https://github.com/MohameddSheriff/mysql-openshift/blob/master/images/Screen%20Shot%202020-03-26%20at%2012.51.05%20AM.png "Pods")
        - Open *MySQL Workbench* and add a new connection using your database credentials and the allocated port to your localhost.
          ![alt text](https://github.com/MohameddSheriff/mysql-openshift/blob/master/images/Screen%20Shot%202020-03-26%20at%2012.53.12%20AM.png "workbench")
        
        - once connected, execute the following query to create a new table: 
        
        `USE sampledb; DROP TABLE IF EXISTS customer; CREATE TABLE IF NOT EXISTS customer ( id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, customerName VARCHAR( 255 ) NOT NULL, effectiveDate VARCHAR( 255 ), description TEXT, status VARCHAR( 255 ) NOT NULL );`
        - Then execute this to add data to the table: 
         
        
        `USE sampledb; INSERT INTO customer VALUES (1,'Testers Inc.','2020-04-01','Testers are who we hire to test our software','active'), (2,'Deployers CO','2019-06-01','Deployers co. deploy our software','active'), (3,'DJ John Doe','2019-12-01','John provides the music for our annual holiday party.',"active"), (4,'Doe Hypermarket','2019-06-05','Doe is where we purchase all food supply.',"active");`
        
          -  ![alt text](https://github.com/MohameddSheriff/mysql-openshift/blob/master/images/Screen%20Shot%202020-03-26%20at%2012.54.42%20AM.png "workbench") 
        




# Deploying a microservices-based application and integrating it to our database.
  

## 1. Create the getCustomer service
#### Note: The variables 'MYSQL_USER' and 'MYSQL_PASSWORD' are determined by the values returned after you create the MySQL service, above.  

`oc new-app https://github.com/MohameddSheriff/mysql-openshift --context-dir=src/getCustomer --name getcustomer -e MYSQL_HOST=mysql -e MYSQL_DATABASE=sampledb -e MYSQL_USER=<YOUR_USERNAME> -e MYSQL_PASSWORD=<YOUR_PASSWORD>`

## 2. Expose the getCustomer service

`oc expose service getcustomer --insecure-skip-tls-verify=false`

## 3. Create the getCustomerList service
#### Note: The variables 'MYSQL_USER' and 'MYSQL_PASSWORD' are determined by the values returned after you create the MySQL service, above.  

`oc new-app https://github.com/MohameddSheriff/mysql-openshift --context-dir=src/getCustomerList --name getcustomerlist -e MYSQL_HOST=mysql -e MYSQL_DATABASE=sampledb -e MYSQL_USER=<YOUR_USERNAME> -e MYSQL_PASSWORD=<YOUR_PASSWORD>`  


## 4. Expose the getCustomerList service

`oc expose service getcustomerlist --insecure-skip-tls-verify=false`

## 5. Get the two services' routes
`oc get routes`

![alt text](https://github.com/MohameddSheriff/mysql-openshift/blob/master/images/Screen%20Shot%202020-03-26%20at%201.32.39%20AM.png
 "routes") 
        

## 5. Create the service "customerui"
This will pull a container image from Docker Hub. This is being done to showcase the versatility of the OpenShift application build feature.
#### Note: The variables 'REACT_APP_CUSTOMER_LIST_URI' and 'REACT_APP_CUSTOMER_URI' are determined by the values returned from the previous step 
`oc new-app --name customerui --docker-image=docker.io/mohamed7sherif/mysql-react:latest -e REACT_APP_CUSTOMER_LIST_URI="http://<getcustomerlist_SERVICE_URI>/customers" -e REACT_APP_CUSTOMER_URI="http://<getcustomer_SERVICE_URI>/customer/"`

## Expose the customerui web site
`oc expose service customerui --insecure-skip-tls-verify=false`

## Test it
Get the route, then open it in your browser:  
`oc get routes`
Copy the route named *customerui* and paste it in your browser to make sure the application is running.

