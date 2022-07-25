package pt.uc.dei.paj.entity;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "Users")
public class User implements Serializable{

	private static final long serialVersionUID = 1L;
	
	@Column(updatable = false)
	@Id
	private String username;
	
	@NotBlank
	private String firstName;
	
	@NotBlank
	private String lastName;
	
	@NotBlank
	@Column(name = "user_email", unique = true)
	private String email;
	
	@NotBlank
	@Column (name = "user_password")
	private String password;
	
	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private Timestamp creationDate;
	
	@Enumerated(EnumType.STRING)
	private Type type;
	
	private String profilePic;
	private String biography;
	private boolean approved;
	private String token;
	
	@OneToMany(mappedBy = "ownerProj", cascade = CascadeType.REMOVE)
	private Collection<Project> projectsOwned;
	
	@OneToMany(mappedBy = "ownerNews", cascade = CascadeType.REMOVE)
	private Collection<NewsPiece> newsOwned;
	
	@ManyToMany(mappedBy = "projectMemberList")
	private Collection<Project> projectColabList;
	
	@ManyToMany(mappedBy = "newsCoAuthorsList")
	private Collection<NewsPiece> newsColabList;

	//getters and setters
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Timestamp getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Timestamp creationDate) {
		this.creationDate = creationDate;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public String getProfilePic() {
		return profilePic;
	}

	public void setProfilePic(String profilePic) {
		this.profilePic = profilePic;
	}

	public String getBiography() {
		return biography;
	}

	public void setBiography(String biography) {
		this.biography = biography;
	}

	public boolean isApproved() {
		return approved;
	}

	public void setApproved(boolean approved) {
		this.approved = approved;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Collection<Project> getProjectsOwned() {
		return projectsOwned;
	}

	public void setProjectsOwned(Collection<Project> projectsOwned) {
		this.projectsOwned = projectsOwned;
	}

	public Collection<NewsPiece> getNewsOwned() {
		return newsOwned;
	}

	public void setNewsOwned(Collection<NewsPiece> newsOwned) {
		this.newsOwned = newsOwned;
	}

	public Collection<Project> getProjectColabList() {
		return projectColabList;
	}

	public void setProjectColabList(Collection<Project> projectColabList) {
		this.projectColabList = projectColabList;
	}

	public Collection<NewsPiece> getNewsColabList() {
		return newsColabList;
	}

	public void setNewsColabList(Collection<NewsPiece> newsColabList) {
		this.newsColabList = newsColabList;
	}
	
	
}
