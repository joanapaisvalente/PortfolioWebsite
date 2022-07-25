package pt.uc.dei.paj.entity;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "Noticias")
public class NewsPiece implements Serializable{

	private static final long serialVersionUID = 1L;
	
	@Column(updatable = false)
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private Timestamp creationDate;
	
	@NotBlank
	private String title;
	
	@NotBlank
	private String description;
	
	@UpdateTimestamp
	@Column(nullable = false)
	private Timestamp lastUpdate;
	
	private String image;
	
	@Enumerated(EnumType.STRING)
	private Status status;
	
	@ManyToOne
	@JoinColumn(name = "User_owner")
	private User ownerNews;
	
	@ManyToMany
	private List<User> newsCoAuthorsList;
	
	
	private String keywordListNewsPiece;
	
	@ManyToMany(mappedBy="newsList")
	private Collection<Project> projectList;
	

	public NewsPiece() {
		
	}

	//gettersand setters
	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public Timestamp getCreationDate() {
		return creationDate;
	}


	public void setCreationDate(Timestamp creationDate) {
		this.creationDate = creationDate;
	}


	public String getTitle() {
		return title;
	}


	public void setTitle(String title) {
		this.title = title;
	}


	public String getDescription() {
		return description;
	}


	public void setDescription(String description) {
		this.description = description;
	}


	public Timestamp getLastUpdate() {
		return lastUpdate;
	}


	public void setLastUpdate(Timestamp lastUpdate) {
		this.lastUpdate = lastUpdate;
	}


	public String getImage() {
		return image;
	}


	public void setImage(String image) {
		this.image = image;
	}


	public Status getStatus() {
		return status;
	}


	public void setStatus(Status status) {
		this.status = status;
	}


	public User getOwnerNews() {
		return ownerNews;
	}


	public void setOwnerNews(User ownerNews) {
		this.ownerNews = ownerNews;
	}


	public List<User> getNewsCoAuthorsList() {
		return newsCoAuthorsList;
	}


	public void setNewsCoAuthorsList(List<User> newsCoAuthorsList) {
		this.newsCoAuthorsList = newsCoAuthorsList;
	}


	public String getKeywordListNewsPiece() {
		return keywordListNewsPiece;
	}


	public void setKeywordListNewsPiece(String keywordListNewsPiece) {
		this.keywordListNewsPiece = keywordListNewsPiece;
	}


	public Collection<Project> getProjectList() {
		return projectList;
	}


	public void setProjectList(Collection<Project> projectList) {
		this.projectList = projectList;
	}
}
