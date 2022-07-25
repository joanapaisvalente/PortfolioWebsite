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
@Table(name = "Projetos")
public class Project implements Serializable{
	
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
	private User ownerProj;
	
	@ManyToMany/*(fetch = FetchType.EAGER)*/
	//@LazyCollection(LazyCollectionOption.FALSE)
	private List<User> projectMemberList;
	
	private String keywordListProject;
	
	@ManyToMany
	private Collection<NewsPiece> newsList;
	//projeto manda em relação às notícias

	//getters and setters
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

	public User getOwnerProj() {
		return ownerProj;
	}

	public void setOwnerProj(User ownerProj) {
		this.ownerProj = ownerProj;
	}

	public List<User> getProjectMemberList() {
		return projectMemberList;
	}

	public void setProjectMemberList(List<User> projectMemberList) {
		this.projectMemberList = projectMemberList;
	}

	public String getKeywordListProject() {
		return keywordListProject;
	}

	public void setKeywordListProject(String keywordListProject) {
		this.keywordListProject = keywordListProject;
	}

	public Collection<NewsPiece> getNewsList() {
		return newsList;
	}

	public void setNewsList(Collection<NewsPiece> newsList) {
		this.newsList = newsList;
	}

	@Override
	public String toString() {
		return "Project [id=" + id + ", creationDate=" + creationDate + ", title=" + title + ", description="
				+ description + ", lastUpdate=" + lastUpdate + ", image=" + image + ", status=" + status
				+ ", ownerProj=" + ownerProj + ", projectMemberList=" + projectMemberList + ", keywordListProject="
				+ keywordListProject + ", newsList=" + newsList + "]";
	}

}
