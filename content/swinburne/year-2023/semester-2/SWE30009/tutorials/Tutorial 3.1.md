---
title: "Tutorial 3.1: ACF Lab 2 - Build a VPC and launch a Web Server"
tags: 
- COS20019/Tutorials
- Tutorial_3
- Marked-off
---

In this lab, you will use Amazon Virtual Private Cloud (VPC) to create your own VPC and add additional components to produce a customized network. You will also create a security group. You will then configure and customize an EC2 instance to run a web server and you will launch the EC2 instance to run in a subnet in the VPC.

**Amazon Virtual Private Cloud (Amazon VPC)** enables you to launch Amazon Web Services (AWS) resources into a virtual network that you defined. This virtual network closely resembles a traditional network that you would operate in your own data centre, with the benefits of using the scalable infrastructure of AWS. You can create a VPC that spans multiple Availability Zones.

After completing this lab, you should be able to do the following:
- Create a VPC.
- Create subnets.
- Configure a security group.
- Launch an EC2 instance into a VPC.

### Scenario
In this lab you build the following infrastructure:

![[../resources/tute3.1-scenario.png]]

## Instruction

### Task 1: Create Your VPC

>[!info] In this task, you will use the _VPC and more_ option in the VPC console to create multiple resources, including a _VPC_, an _Internet Gateway_, a _public subnet_ and a _private subnet_ in a single Availability Zone, two _route tables_, and a _NAT Gateway_.

>[!example] Step 1: In the search box to the right of **Services**, search for and choose **VPC** to open the VPC console

>[!example]- Step 2: Begin creating a VPC
>
>- In the top right of the screen, verify that **N. Virginia (us-east-1)** is the region.
>- Choose the **VPC dashboard** link which is also towards the top left of the console.
>- Next, choose `Create VPC`.
>
>>[!note] Note: If you do not see a button with that name, choose the Launch VPC Wizard button instead.

>[!example]- Step 3: Configure the VPC details in the _VPC settings_ panel on the left:
>
>- Choose **VPC and more**.
>- Under **Name tag auto-generation**, keep _Auto-generate_ selected, however change the value from project to `lab`.
>- Keep the **IPv4 CIDR block** set to 10.0.0.0/16
>- For **Number of Availability Zones**, choose **1**.
>- For **Number of _public_ subnets**, keep the **1** setting.
>- For **Number of _private_ subnets**, keep the **1** setting.
>- Expand the **Customize subnets CIDR blocks** section
>	- Change **Public subnet CIDR block in us-east-1a** to `10.0.0.0/24`
>	- Change **Private subnet CIDR block in us-east-1a** to `10.0.1.0/24
>- Set **NAT gateways** to **In 1 AZ**.
>- Set **VPC endpoints** to **None**.
>- Keep both **DNS hostnames** and **DNS resolution** _enabled_.

>[!example]- Step 4: In the _Preview_ panel on the right, confirm the settings you have configured
>
>- **VPC:** `lab-vpc`
>- **Subnets**:
>	- us-east-1a
>	- **_Public_ subnet name:** `lab-subnet-public1-us-east-1a`
>	- **_Private_ subnet name:** `lab-subnet-private1-us-east-1a`
>- **Route tables**
>	- `lab-rtb-public`
>	- `lab-rtb-private1-us-east-1a`
>- **Network connections**
>	- `lab-igw`
>	- `lab-nat-public1-us-east-1a`

>[!example]- Step 5: At the bottom of the screen, choose Create VPC 
>
>The VPC resources are created. The NAT Gateway will take a few minutes to activate.
>
>Please wait until _all_ the resources are created before proceeding to the next step.

>[!example]- Step 6: Once it is complete, choose `View VPC`
>
>The wizard has provisioned a VPC with a public subnet and a private subnet in one Availability Zone with route tables for each subnet. It also created an Internet Gateway and a NAT Gateway.
>
>To view the settings of these resources, browse through the VPC console links that display the resource details. The diagram below summarizes the VPC resources you have just created and how they are configured.
>
>![[../resources/tute3.1-t1-s6.png]]
>
>>[!info]- Internet Gateway
>>
>>An _Internet gateway_ is a VPC resource that allows communication between EC2 instances in your VPC and the Internet.
>>
>>The `lab-subnet-public1-us-east-1a` public subnet has a CIDR of **10.0.0.0/24**, which means that it contains all IP addresses starting with **10.0.0.x**. The fact the route table associated with this public subnet routes 0.0.0.0/0 network traffic to the internet gateway is what makes it a public subnet.
>
>>[!info]- NAT Gateway
>>
>>A _NAT Gateway_, is a VPC resource used to provide internet connectivity to any EC2 instances running in _private_ subnets in the VPC without those EC2 instances needing to have a direct connection to the internet gateway.
>>
>>The `lab-subnet-private1-us-east-1a` private subnet has a CIDR of **10.0.1.0/24**, which means that it contains all IP addresses starting with **10.0.1.x**.

### Task 2: Create Additional Subnets

>[!info] In this task, you will create two additional subnets for the VPC in a second Availability Zone. Having subnets in multiple Availability Zones within a VPC is useful for deploying solutions that provide _High Availability_.

> After creating a VPC as you have already done, you can still configure it further, for example, by adding more **subnets**. Each subnet you create resides entirely within one Availability Zone.

>[!example] Step 1: In the left navigation pane, choose **Subnets**
>
>First, you will create a second _public_ subnet.

>[!example]- Step 2: Choose `Create subnet` then configure
>
>- **VPC ID:** **lab-vpc** (select from the menu)
>- **Subnet name:** `lab-subnet-public2`
>- **Availability Zone:** Select the _second_ Availability Zone (for example, `us-east-1b`
>- **IPv4 CIDR block:** `10.0.2.0/24`
>
>The subnet will have all IP addresses starting with **10.0.2.x**.

>[!example]- Step 3: Choose `Create subnet`
>
>The second _public_ subnet was created. You will now create a second _private_ subnet.

>[!example]- Step 4: Choose `Create subnet` then configure
>
>- **VPC ID:** `lab-vpc`
>- **Subnet name:** `lab-subnet-private2`
>- **Availability Zone:** Select the _second_ Availability Zone (for example, us-east-1b)
>- **IPv4 CIDR block:** `10.0.3.0/24`
>
>The subnet will have all IP addresses starting with **10.0.3.x**.
>

>[!example]- Step 5: Choose `Create subnet`
>
>The second _private_ subnet was created.
>
>You will now configure this new _private_ subnet to route internet-bound traffic to the NAT Gateway so that resources in the second private subnet are able to connect to the Internet, while still keeping the resources private. This is done by configuring a _Route Table_.
>
>A _route table_ contains a set of rules, called _routes_, that are used to determine where network traffic is directed. Each subnet in a VPC must be associated with a route table; the route table controls routing for the subnet.

>[!example] Step 6: In the left navigation pane, choose **Route tables**

>[!example] Step 7: Select the **lab-rtb-private1-us-east-1a** route table

>[!example]- Step 8: In the lower pane, choose the **Routes** tab
>
>Note that **Destination 0.0.0.0/0** is set to **Target nat-xxxxxxxx**. This means that traffic destined for the internet (0.0.0.0/0) will be sent to the NAT Gateway. The NAT Gateway will then forward the traffic to the internet.
>
>This route table is therefore being used to route traffic from private subnets.

>[!example]- Step 9: Choose the **Subnet associations** tab
>
>You created this route table in task 1 when you chose to create a VPC and multiple resources in the VPC. That action also created _lab-subnet-private-1_ and associated that subnet with this route table.
>
>Now that you have created another private subnet, lab-subnet-private-2, you will associate this route table with that subnet as well.

>[!example] Step 10: In the Explicit subnet associations panel, choose `Edit subnet associations`

>[!example] Step 11: Leave **lab-subnet-private1-us-east-1a** selected, but also select **lab-subnet-private2**

>[!example]- Step 12: Choose `Save associations`
>
>You will now configure the Route Table that is used by the Public Subnets.

>[!example] Step 13: Select the **lab-rtb-public** route table (and deselect any other subnets)

>[!example]- Step 14: In the lower pane, choose the **Routes** tab
>
>Note that **Destination 0.0.0.0/0** is set to Target **igw-xxxxxxxx**, which is an Internet Gateway. This means that internet-bound traffic will be sent straight to the internet via this Internet Gateway.
>
>You will now associate this route table to the second public subnet you created.

>[!example] Step 15: Choose the **Subnet associations** tab

>[!example]  Step 16: In the Explicit subnet associations area, choose `Edit subnet associations`
>

>[!example] Step 17: Leave **lab-subnet-public1-us-east-1a** selected, but also select **lab-subnet-public2**

>[!example]- Step 18: Choose `Save associations`
>
>Your VPC now has public and private subnets configured in two Availability Zones. The route tables you created in task 1 have also been updated to route network traffic for the two new subnets.
>
>![[../resources/tute3.1-t2-s18.png]]

### Task 3: Create a VPC Security Group

>[!info] In this task, you will create a VPC security group, which acts as a virtual firewall. When you launch an instance, you associate one or more security groups with the instance. You can add rules to each security group that allow traffic to or from its associated instances.

>[!example] Step 1: In the left navigation pane, choose **Security groups**

>[!example]- Step 2: Choose `Create security group` and then configure
>
>- **Security group name:** `Web Security Group`
>- **Description:** `Enable HTTP access`  
>- **VPC:** choose the X to remove the currently selected VPC, then from the drop down list choose **lab-vpc**

>[!example] Step 3: In the **Inbound rules** pane, choose `Add rule`

>[!example]- Step 4: Configure the following settings
>
>- **Type:** *HTTP*   
>- **Source:**  *Anywhere-IPv4*
>- **Description:** `Permit web requests`

>[!example]- Step 5: Scroll to the bottom of the page and choose `Create security group`
>
>You will use this security group in the next task when launching an Amazon EC2 instance.

### Task 4: Launch a Web Server Instance

>[!info] In this task, you will launch an Amazon EC2 instance into the new VPC. You will configure the instance to act as a web server.

>[!example] Step 1: In the search box to the right of **Services**, search for and choose **EC2** to open the EC2 console

>[!example] Step 2: From the Launch instance menu choose **Launch instance**

>[!example]- Step 3: Name the instance
>
>- Give it the name `Web Server 1`
>
>	When you name your instance, AWS creates a tag and associates it with the instance. A tag is a key value pair. The key for this pair is _***Name***_, and the value is the name you enter for your EC2 instance.

>[!example]- Step 4: Choose an AMI from which to create the instance
>
>- In the list of available _Quick Start_ AMIs, keep the default **Amazon Linux** selected.  
>- Also keep the default **Amazon Linux 2023 AMI** selected.
>
>   The type of _Amazon Machine Image (AMI)_ you choose determines the Operating System that will run on the EC2 instance that you launch.

>[!example]- Step 5: Choose an Instance type
>
>In the _Instance type_ panel, keep the default **t2.micro** selected.
>
>The _Instance Type_ defines the hardware resources assigned to the instance.

>[!example]- Step 6: Select the key pair to associate with the instance
>
>From the **Key pair name** menu, select **vockey**.
>
>The vockey key pair you selected will allow you to connect to this instance via SSH after it has launched. Although you will not need to do that in this lab, it is still required to identify an existing key pair, or create a new one, when you launch an instance.

>[!example]- Step 7: Configure the Network settings
>
>- Next to Network settings, choose **Edit**, then configure: 
>	- **Network:** *lab-vpc*
>	- **Subnet:** *lab-subnet-public2* (_not_ Private!)
>	- **Auto-assign public IP:** *Enable*
>- Next, you will configure the instance to use the *Web Security Group* that you created earlier.
>	- Under Firewall (security groups), choose **Select existing security group**.  
>	- For **Common security groups**, select **Web Security Group**.
>	
>		This security group will permit HTTP access to the instance.

>[!example]- Step 8: In the _Configure storage_ section, keep the default settings
>
>>[!note] Note
>>
>> The default settings specify that the _root volume_ of the instance, which will host the Amazon Linux guest operating system that you specified earlier, will run on a general purpose SSD (_gp3_) hard drive that is 8 GiB in size. You could alternatively add more storage volumes, however that is not needed in this lab.

>[!example]- Step 9: Configure a script to run on the instance when it launches
>
>- Expand the **Advanced details** panel.    
>- Scroll to the bottom of the page and then copy and paste the code shown below into the **User data** box:
><pre>#!/bin/bash<br># Install Apache Web Server and PHP<br>dnf install -y httpd wget php mariadb105-server<br># Download Lab files<br>wget https://aws-tc-largeobjects.s3.us-west-2.amazonaws.com/CUR-TF-100-ACCLFO-2/2-lab2-vpc/s3/lab-app.zip<br>unzip lab-app.zip -d /var/www/html/<br># Turn on web server<br>chkconfig httpd on <br>service httpd start</pre>
>
>This script will run with root user permissions on the guest OS of the instance. It will run automatically when the instance launches for the first time. The script installs a web server, a database, and PHP libraries, and then it downloads and installs a PHP web application on the web server.

>[!example]- Step 10: At the bottom of the **Summary** panel on the right side of the screen choose `Launch instance`
>
>You will see a Success message.

>[!example]- Step 11: Choose `View all instances`
>
>Choose View all instances

>[!example]- Step 12: Wait until **Web Server 1** shows _2/2 checks passed_ in the **Status check** column
>
>You will now connect to the web server running on the EC2 instance.

>[!example] Step 13: Select **Web Server 1**

>[!example] Step 14: Copy the **Public IPv4 DNS** value shown in the **Details** tab at the bottom of the page

>[!example]- Step 15: Open a new web browser tab, paste the **Public DNS** value and press Enter
>
>You should see a web page displaying the AWS logo and instance meta-data values.
>
>The complete architecture you deployed is:
>![[../resources/tute3.1-t4-s15.png]]
## For In-class only

>[!important] Access [CollaborateUltra session](https://au.bbcollab.com/guest/a9aa68f8819944b0b5bcb9ad39e25e71)

>[!important] For in-class demo sign-up with [Slido](https://app.sli.do/event/buT4Wwji1gUasFjY59TEJn)
