package pt.uc.dei.paj.dto;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import pt.uc.dei.paj.entity.Status;

@XmlRootElement
public class DTONewsPiece implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	private String title;
	private String description;
	private String lastUpdate;
	private String image;
	private Status status;
	private DTOUser owner;
	private List<String> coauthorList;
	private String keywordList;
	private int id;
	
	public DTONewsPiece() {
		
	}

	//getters and setters
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

	public String getLastUpdate() {
		return lastUpdate;
	}

	public void setLastUpdate(String lastUpdate) {
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

	public DTOUser getOwner() {
		return owner;
	}

	public void setOwner(DTOUser owner) {
		this.owner = owner;
	}

	public List<String> getCoauthorList() {
		return coauthorList;
	}

	public void setCoauthorList(List<String> coauthorList) {
		this.coauthorList = coauthorList;
	}

	public String getKeywordList() {
		return keywordList;
	}

	public void setKeywordList(String keywordList) {
		this.keywordList = keywordList;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
}
