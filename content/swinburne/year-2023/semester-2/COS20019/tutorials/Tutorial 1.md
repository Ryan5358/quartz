---
title: "Tutorial 1: Introduction to Cloud Computing" 
tags: 
- COS20019/Tutorials
- Setup EC2
- SSH EC2
---

This lab is designed as an introduction to the AWS Academy. It aims to provide you with a quick overview of what the academy offers, including resources like quizzes and training materials, all available through a dedicated Canvas website.

During this lab, you'll get to know essential Linux commands. These commands are important because Linux is widely used throughout this course.

By the end of this lab, you'll be comfortable with a variety of Linux commands. You'll also have the skills to remotely access an EC2 instance using an SSH connection. This process can be achieved using Powershell/PuTTY on Windows or Terminal on MacOS/Linux.


>[!media]- Watch Demo
>
>![[../resources/SSH to ec2 instances using Powershell-20230804_170751-Meeting Recording.mp4|SSH to ec2 instances using Powershell-20230804_170751-Meeting Recording]]
## Setting up EC2 Instance

1. Start Lab... then wait until `Lab status: ready`
2. Click `AWS` button to open the AWS Console
3. Access `EC2` Service via the Services menu or under `Recently visited`
4. Creating key pair with a `key-name`

```powershell
# Generate public key
ssh-keygen

# Specify key name in the process [key-name]
```

>[!warning]- Public key is **available** and can be **reused**
>
>Public key `ssh_key` was generated at `C:\Users\ADMIN` . Upload or paste the content of `ssh_key.pub` and use path to `ssh_key` for access command.

5. Create a key pair in console using the generated one then launch an EC2 Instance
## Access EC2 instance via SSH

```powershell
ssh -i [key-name path] ec2-user@[publc-ip-address]

# Enter 'yes' to continue
```

---
## Introduction to the Linux command line

1. Change directory `cd`

```bash
# Change directory to the root directory
cd /

# Change directory to home directory
cd ~

# Using relative path:
# Change directory to sub directory
cd ./path/to/sub/dir

# Change firectory to the parent directory
cd ../

# or using an absolute path
cd root/absolute/path/to/dir
```

2. Read and write file

```bash
# Use echo to write a small file
echo “This is a test” > test.txt

# See the content of a file
cat test.txt

#Remove a file
rm test.txt
```

3. Input/Output Redirection

```bash
# To direct the output of a command and write it to a file
ls > file_list.txt

# Redirect the output and append it to the file
ls >> file_list.txt

# Pipe operator `|` : Connect Standard output of a command with Standard input of the next command
cat file_list.txt|sort
```

4. Useful commands

```bash
# To see the current user
whoami

# To see current directory (print working directory)
pwd

# To see the content of the current directory
ls

# To see all files including hidden one
ls -a

# To list all details of the content of a directory
ls -l

# To make a directory in your current location
mkdir directoryname

# To see the Amazon Linux 2 distribution and version
cat /proc/version

# To get help
man command
# or 
info command

# Browse page by page the content of a file or output of a command
# Example:
ls –l |less
# q: quit `less` 
# >: go to end of file
```

5. To change the access rights and issue commands as the root (superuser) user

```bash
# To change the access rights and issue commands as the root (superuser) user whenever you need to do something like to install software that requires admin rights switch to the administrative role
sudo su
```

6. Installing programs

```bash
# Updates the yum package (yum is the primary tools to install and update programs in  some Linux distributions such as RedHat and Ubuntu)
sudo yum update -y

# <!> The user data script run on the first launch of an EC2 instance is run by the superuser
# <!> To install, update and remove software Amazon Linux 2 uses yum command.

# Install Apache (httpd)
sudo yum install -y httpd

# Install PHP
sudo yum install -y php
```

7. Starting program

```bash
# To start the httpd service (just until we stop it or the EC2 instance is stopped/rebooted)
sudo systemctl start httpd

# To enable the httpd service (start it each time the system is booted from the next reboot)
sudo systemctl enable httpd
```

8. Decompress `gz` files

```bash
# With Linux we often use tar files with gz compression. To decompress gz files in the current directory
tar –zxvf yourfile.tar.gz
```

9. Troubleshooting

```bash
# Check that httpd is active (running)
systemctl status httpd  

# Check all running processes such as Http and open ports
ss -tl

# Check the most recent 100 log entries
journalctl -a | tail -n 100

# Or for a specific service e.g.
journalctl -a | grep httpd | tail -n 100
```

## Practical exercise: Creating a php info file

>[!info] Let’s use vim to create a php info file

1. Open the file we wish to create
```bash
sudo vim /var/www/html/phpinfo.php
```

2. Press the `i` key to enable insert, then type in or paste in the following:
```php
<?php  
phpinfo();  
?>
```

3. Once you have done this press the `ESC` (escape) key and type `:wq` (no quotes, w means write and q  
means quit).

4. Press `Enter`/`Return` and the changes you made to the file will be saved.

>[!hint] If you made a mistake and want to recreate the file from scratch you can remove the php info  file using the rm command
>
><pre style="margin-top: 10px">sudo rm /var/www/html/phpinfo.php</pre>

5. Open the webpage using URL: `http://<Public IP address>/phpinfo.php`
	You should see a PHP info page similar to below
	![[../resources/tute1-screenshot.png]]
## For In-class only

>[!important] Access [CollaborateUltra session](https://au.bbcollab.com/guest/a9aa68f8819944b0b5bcb9ad39e25e71)