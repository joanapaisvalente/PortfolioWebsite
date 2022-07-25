package pt.uc.dei.paj.service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import pt.uc.dei.paj.dao.DAONewsPiece;
import pt.uc.dei.paj.dao.DAOProject;
import pt.uc.dei.paj.dao.DAOUser;
import pt.uc.dei.paj.dto.DTONewsPiece;
import pt.uc.dei.paj.dto.DTOProject;
import pt.uc.dei.paj.dto.DTOUser;
import pt.uc.dei.paj.entity.NewsPiece;
import pt.uc.dei.paj.entity.Project;
import pt.uc.dei.paj.entity.Status;
import pt.uc.dei.paj.entity.Type;
import pt.uc.dei.paj.entity.User;

@RequestScoped
public class ProjectService implements Serializable {

	private static final long serialVersionUID = 1L;

	@Inject
	DAOProject projectDao;
	@Inject
	DAOUser userDao;
	@Inject
	UserService userService;
	@Inject
	DAONewsPiece newsDao;

	public ProjectService() {

	}

	// método para criar um novo projeto
	public void createProject(DTOProject projectDto, User user) throws Exception {

		System.out.println("kkkkkkkkkkkkkkkkkkkkkkkk");
		// set to status
		Project project = projectDao.convertDtoToEntity(projectDto, user);
		project.setStatus(Status.visible);

		if (!projectDto.getCoauthorList().isEmpty() || projectDto.getCoauthorList() != null) {

			List<User> arrayCoAuthorList = new ArrayList<>();

			System.out.println("uiiiii");
			for (String username : projectDto.getCoauthorList()) {

				System.out.println("wwwwwwwwwweeeeeeeeeeeewwwwwwwwwwwwww" + username);
				User userCo = userService.findUserEntity(username);
				System.out.println("oi?" + userCo.getFirstName() + " " + userCo.getLastName());
				if (userCo != null) {
					// project.getProjectMemberList().add(userCo);
					if (userCo.isApproved()) {
						arrayCoAuthorList.add(userCo);
					}
				}

			}
			project.setProjectMemberList(arrayCoAuthorList);
			System.out.println("caneco");
			projectDao.persist(project);
			System.out.println("canecoooooo");
		}
	}

	public void editProject(DTOProject projectDto, int id) throws Exception {

		Project projectAux = projectDao.find(id);

		Project project = projectDao.convertDtoToEntity(projectDto, projectAux);

		if (!projectDto.getCoauthorList().isEmpty() || projectDto.getCoauthorList() != null) {
			List<User> arrayCoAuthorList = new ArrayList<>();

			System.out.println("uiiiii");
			for (String username : projectDto.getCoauthorList()) {

				System.out.println("wwwwwwwwwweeeeeeeeeeeewwwwwwwwwwwwww" + username);
				User userCo = userService.findUserEntity(username);
				System.out.println("oi?" + userCo.getFirstName() + " " + userCo.getLastName());
				if (userCo != null) {
					// project.getProjectMemberList().add(userCo);
					if (userCo.isApproved()) {
						arrayCoAuthorList.add(userCo);
					}
				}

			}
			project.setProjectMemberList(arrayCoAuthorList);
			System.out.println("caneco");
			projectDao.merge(project);
			System.out.println("canecoooooo");
		}
	}

	public List<DTOProject> findStatusProject(Status status) throws Exception {
		System.out.println("tipooo" + status);

		List<Project> projectList = projectDao.listProjectAccordingToStatus(status);
		List<DTOProject> dtoProjectList = new ArrayList<>();

		System.out.println("espinafres");
		for (Project project : projectList) {
			System.out.println("projeto");
			DTOProject dto = projectDao.convertEntityToDto(project);
			System.out.println("projetoooo" + dto);
			try {
				DTOUser ownerDto = userService.findUser(project.getOwnerProj().getUsername());
				System.out.println("ownerrrr" + ownerDto.getUsername());
				dto.setOwner(ownerDto);
				System.out.println("estamossss");
			} catch (Exception e) {
				return null;
			}
			/*
			 * List<String> authorList = new ArrayList<>();
			 * System.out.println("antes do for"); //System.out.println("lista" +
			 * project.getProjectMemberList()); for(User
			 * userAux:project.getProjectMemberList()) { System.out.println("@@@@" +
			 * userAux.getUsername()); authorList.add(userAux.getUsername()); }
			 * 
			 * System.out.println("hihi"); dto.setCoauthorList(authorList);
			 * System.out.println("uhuh");
			 * 
			 * dtoProjectList.add(dto);
			 */

			List<User> projectUserList = projectDao.getProjectMembers(project.getId());

			System.out.println(projectUserList.size());

			if (projectUserList.size() > 0) {
				System.out.println("oi tenho a lista mas não a posso ver" + projectUserList.get(0).getEmail());
				List<String> usernameList = new ArrayList<>();
				for (User user : projectUserList) {
					if (user.isApproved()) {
						System.out.println("!!!!!!!!!!!" + user.getUsername());
						usernameList.add(user.getUsername());
					}
				}
				System.out.println("huhahahahahaha");
				dto.setCoauthorList(usernameList);

			}

			// TODO FAZER O MESMO PARA A LISTA DE NOTÍCIAS ASSOCIADAS AO PROJETO

			dtoProjectList.add(dto);
		}
		return dtoProjectList;
	}

	public List<DTOProject> findProjectVisAndInvis() throws Exception {

		List<Project> projectList = projectDao.listProjectsVisAndInvis();
		List<DTOProject> dtoProjectList = new ArrayList<>();

		for (Project project : projectList) {
			System.out.println("projeto");
			DTOProject dto = projectDao.convertEntityToDto(project);
			System.out.println("projetoooo" + dto);
			try {
				DTOUser ownerDto = userService.findUser(project.getOwnerProj().getUsername());
				System.out.println("ownerrrr" + ownerDto.getUsername());
				dto.setOwner(ownerDto);
				System.out.println("estamossss");
			} catch (Exception e) {
				return null;
			}
			/*
			 * List<String> authorList = new ArrayList<>();
			 * System.out.println("antes do for"); //System.out.println("lista" +
			 * project.getProjectMemberList()); for(User
			 * userAux:project.getProjectMemberList()) { System.out.println("@@@@" +
			 * userAux.getUsername()); authorList.add(userAux.getUsername()); }
			 * 
			 * System.out.println("hihi"); dto.setCoauthorList(authorList);
			 * System.out.println("uhuh");
			 * 
			 * dtoProjectList.add(dto);
			 */

			List<User> projectUserList = projectDao.getProjectMembers(project.getId());

			System.out.println(projectUserList.size());

			if (projectUserList.size() > 0) {
				System.out.println("oi tenho a lista mas não a posso ver" + projectUserList.get(0).getEmail());
				List<String> usernameList = new ArrayList<>();
				for (User user : projectUserList) {
					if (user.isApproved()) {
						System.out.println("!!!!!!!!!!!" + user.getUsername());
						usernameList.add(user.getUsername());
					}
				}
				System.out.println("huhahahahahaha");
				dto.setCoauthorList(usernameList);

			}

			// TODO FAZER O MESMO PARA A LISTA DE NOTÍCIAS ASSOCIADAS AO PROJETO

			dtoProjectList.add(dto);
		}
		return dtoProjectList;
	}

	public List<DTOProject> findMyProject(User user) throws Exception {

		List<Project> projectList = projectDao.getMyProjects(user.getUsername());
		List<DTOProject> myProjectList = new ArrayList<>();

		for (Project project : projectList) {
			System.out.println("projeto");
			DTOProject dto = projectDao.convertEntityToDto(project);
			System.out.println("projetoooo" + dto);
			try {
				DTOUser ownerDto = userService.findUser(project.getOwnerProj().getUsername());
				System.out.println("ownerrrr" + ownerDto.getUsername());
				dto.setOwner(ownerDto);
				System.out.println("estamossss");
			} catch (Exception e) {
				return null;
			}

			List<User> projectUserList = projectDao.getProjectMembers(project.getId());
			// System.out.println("oi tenho a lista mas não a posso ver" +
			// projectUserList.get(0).getEmail());

			if (projectUserList.size() > 0) {
				List<String> usernameList = new ArrayList<>();
				for (User userAux : projectUserList) {
					if (userAux.isApproved()) {
						System.out.println("!!!!!!!!!!!" + userAux.getUsername());
						usernameList.add(userAux.getUsername());
					}
				}
				System.out.println("huhahahahahaha");
				dto.setCoauthorList(usernameList);

			}

			// TODO FAZER O MESMO PARA A LISTA DE NOTÍCIAS ASSOCIADAS AO PROJETO
			myProjectList.add(dto);
		}

		return myProjectList;
	}

	public void toggleStatus(int id, String statusAux) throws Exception {
		System.out.println(statusAux);
		Project project = projectDao.find(id);
		System.out.println(project.getTitle());

		if (statusAux.equals("visible")) {
			System.out.println("ssssssss");
			project.setStatus(Status.visible);

		} else if (statusAux.equals("invisible")) {
			System.out.println("!!!!!");
			project.setStatus(Status.invisible);

		} else if (statusAux.equals("deleted")) {
			System.out.println("WWWWWWWWW");
			project.setStatus(Status.deleted);

		}

		projectDao.merge(project);
	}

	public void manageCoAuthors(int id, User user) throws Exception {
		Project project = projectDao.find(id);
		List<User> projectUserList = projectDao.getProjectMembers(id);
		int aux = -1;
		if (projectUserList.size() > 0) {
			for (int i = 0; i < projectUserList.size(); i++) {
				if (projectUserList.get(i).getUsername().equals(user.getUsername())) {
					aux = i;
				}
			}
		}

		if (aux == -1) {
			projectUserList.add(user);
		} else {
			projectUserList.remove(aux);
		}

		project.setProjectMemberList(projectUserList);

		projectDao.merge(project);

	}

	public DTOProject findProjectById(int id) {
		Project project = projectDao.find(id);
		DTOProject dto = projectDao.convertEntityToDto(project);

		try {
			DTOUser ownerDto = userService.findUser(project.getOwnerProj().getUsername());
			System.out.println("ownerrrr" + ownerDto.getUsername());
			dto.setOwner(ownerDto);
			System.out.println("estamossss");
		} catch (Exception e) {
			return null;
		}

		List<User> projectUserList = projectDao.getProjectMembers(id);
		// System.out.println("oi tenho a lista mas não a posso ver" +
		// projectUserList.get(0).getEmail());
		if (projectUserList.size() > 0) {
			List<String> usernameList = new ArrayList<>();
			for (User userAux : projectUserList) {
				if (userAux.isApproved()) {
					System.out.println("!!!!!!!!!!!" + userAux.getUsername());
					usernameList.add(userAux.getUsername());
				}
			}
			System.out.println("huhahahahahaha");
			dto.setCoauthorList(usernameList);
		}

		// TODO FAZER O MESMO PARA A LISTA DE NOTÍCIAS ASSOCIADAS AO PROJETO
		return dto;

	}
	
	public List<DTOUser> findProjectCoAuthorList(int id) throws Exception {
		List<User> projectUserList = projectDao.getProjectMembers(id);
		List<DTOUser> dtoProjectUserList = new ArrayList<>();
		// System.out.println("oi tenho a lista mas não a posso ver" +
		// projectUserList.get(0).getEmail());
		if (projectUserList.size() > 0) {
			//List<String> usernameList = new ArrayList<>();
			for (User userAux : projectUserList) {
				if (userAux.isApproved()) {
					DTOUser dtoUser = userDao.convertEntityToDto(userAux);
					System.out.println("!!!!!!!!!!!" + userAux.getUsername());
					dtoProjectUserList.add(dtoUser);
				}
			}
			System.out.println("huhahahahahaha");
		}
		return dtoProjectUserList;
	}

	public List<DTOProject> getProjectsUserCoAuthors(User user) throws Exception {

		List<Project> projectListEntity = projectDao.getProjectsUserCoAuthors(user.getUsername());
		List<DTOProject> dtoProjectlist = new ArrayList<>();

		for (Project project : projectListEntity) {
			System.out.println("projeto");
			DTOProject dto = projectDao.convertEntityToDto(project);
			System.out.println("projetoooo" + dto);
			try {
				DTOUser ownerDto = userService.findUser(project.getOwnerProj().getUsername());
				System.out.println("ownerrrr" + ownerDto.getUsername());
				dto.setOwner(ownerDto);
				System.out.println("estamossss");
			} catch (Exception e) {
				return null;
			}
			/*
			 * List<String> authorList = new ArrayList<>();
			 * System.out.println("antes do for"); //System.out.println("lista" +
			 * project.getProjectMemberList()); for(User
			 * userAux:project.getProjectMemberList()) { System.out.println("@@@@" +
			 * userAux.getUsername()); authorList.add(userAux.getUsername()); }
			 * 
			 * System.out.println("hihi"); dto.setCoauthorList(authorList);
			 * System.out.println("uhuh");
			 * 
			 * dtoProjectList.add(dto);
			 */
			List<User> projectUserList = projectDao.getProjectMembers(project.getId());
			System.out.println("oi tenho a lista mas não a posso ver" + projectUserList.get(0).getEmail());
			List<String> usernameList = new ArrayList<>();
			for (User userAux : projectUserList) {
				if (userAux.isApproved()) {
					System.out.println("!!!!!!!!!!!" + userAux.getUsername());
					usernameList.add(userAux.getUsername());
				}
			}
			System.out.println("huhahahahahaha");
			dto.setCoauthorList(usernameList);
			dtoProjectlist.add(dto);

			// TODO FAZER O MESMO PARA A LISTA DE NOTÍCIAS ASSOCIADAS AO PROJETO
		}
		return dtoProjectlist;
	}

	public List<DTOUser> memberList(int id) throws Exception {

		List<User> memberList = projectDao.getProjectMembers(id);
		List<DTOUser> dtoList = new ArrayList<>();

		if (memberList.size() > 0) {
			for (User userAux : memberList) {
				if (userAux.isApproved()) {
					System.out.println("!!!!!!!!!!!" + userAux.getUsername());
					DTOUser dtoUser = userDao.convertEntityToDto(userAux);
					dtoList.add(dtoUser);
				}
			}
		}
		return dtoList;

	}

	public List<DTOProject> projectsWithKeywordsVisibleAndInvisible(String keyword) throws Exception {

		List<Project> projectList = projectDao.getProjectByKeyword(keyword);
		List<DTOProject> dtoProjectList = new ArrayList<>();

		for (Project project : projectList) {
			System.out.println("projeto");
			DTOProject dto = projectDao.convertEntityToDto(project);
			System.out.println("projetoooo" + dto);
			try {
				DTOUser ownerDto = userService.findUser(project.getOwnerProj().getUsername());
				System.out.println("ownerrrr" + ownerDto.getUsername());
				dto.setOwner(ownerDto);
				System.out.println("estamossss");
			} catch (Exception e) {
				return null;
			}
			/*
			 * List<String> authorList = new ArrayList<>();
			 * System.out.println("antes do for"); //System.out.println("lista" +
			 * project.getProjectMemberList()); for(User
			 * userAux:project.getProjectMemberList()) { System.out.println("@@@@" +
			 * userAux.getUsername()); authorList.add(userAux.getUsername()); }
			 * 
			 * System.out.println("hihi"); dto.setCoauthorList(authorList);
			 * System.out.println("uhuh");
			 * 
			 * dtoProjectList.add(dto);
			 */
			List<User> projectUserList = projectDao.getProjectMembers(project.getId());
			// System.out.println("oi tenho a lista mas não a posso ver" +
			// projectUserList.get(0).getEmail());
			if (projectUserList.size() > 0) {
				List<String> usernameList = new ArrayList<>();
				for (User userAux : projectUserList) {
					if (userAux.isApproved()) {
						System.out.println("!!!!!!!!!!!" + userAux.getUsername());
						usernameList.add(userAux.getUsername());
					}
				}
				System.out.println("huhahahahahaha");
				dto.setCoauthorList(usernameList);
			}

			// TODO FAZER O MESMO PARA A LISTA DE NOTÍCIAS ASSOCIADAS AO PROJETO
			dtoProjectList.add(dto);
		}
		return dtoProjectList;
	}

	public List<DTOProject> projectsWithKeywordsVisible(String keyword) throws Exception {

		List<Project> projectList = projectDao.getProjectByKeywordOnlyVisible(keyword);
		List<DTOProject> dtoProjectList = new ArrayList<>();

		for (Project project : projectList) {
			System.out.println("projeto");
			DTOProject dto = projectDao.convertEntityToDto(project);
			System.out.println("projetoooo" + dto);
			try {
				DTOUser ownerDto = userService.findUser(project.getOwnerProj().getUsername());
				System.out.println("ownerrrr" + ownerDto.getUsername());
				dto.setOwner(ownerDto);
				System.out.println("estamossss");
			} catch (Exception e) {
				return null;
			}
			/*
			 * List<String> authorList = new ArrayList<>();
			 * System.out.println("antes do for"); //System.out.println("lista" +
			 * project.getProjectMemberList()); for(User
			 * userAux:project.getProjectMemberList()) { System.out.println("@@@@" +
			 * userAux.getUsername()); authorList.add(userAux.getUsername()); }
			 * 
			 * System.out.println("hihi"); dto.setCoauthorList(authorList);
			 * System.out.println("uhuh");
			 * 
			 * dtoProjectList.add(dto);
			 */
			List<User> projectUserList = projectDao.getProjectMembers(project.getId());
			// System.out.println("oi tenho a lista mas não a posso ver" +
			// projectUserList.get(0).getEmail());
			if (projectUserList.size() > 0) {
				List<String> usernameList = new ArrayList<>();
				for (User userAux : projectUserList) {
					if (userAux.isApproved()) {
						System.out.println("!!!!!!!!!!!" + userAux.getUsername());
						usernameList.add(userAux.getUsername());
					}
				}
				System.out.println("huhahahahahaha");
				dto.setCoauthorList(usernameList);
			}

			// TODO FAZER O MESMO PARA A LISTA DE NOTÍCIAS ASSOCIADAS AO PROJETO

			dtoProjectList.add(dto);
		}
		return dtoProjectList;
	}

	public List<DTONewsPiece> getNewsAssociatedWithProject(int projectId) throws Exception {

		List<NewsPiece> newsAssociatedEntity = projectDao.getAssociatedNews(projectId);
		List<DTONewsPiece> dtoNews = new ArrayList<>();

		for (NewsPiece news : newsAssociatedEntity) {
			DTONewsPiece dto = newsDao.convertEntityToDto(news);

			try {
				DTOUser ownerDto = userService.findUser(news.getOwnerNews().getUsername());
				System.out.println("ownerrrr" + ownerDto.getUsername());
				dto.setOwner(ownerDto);
				System.out.println("estamossss");
			} catch (Exception e) {
				return null;
			}
			List<User> newsUserList = newsDao.getNewsMembers(news.getId());
			// System.out.println("oi tenho a lista mas não a posso ver" +
			// projectUserList.get(0).getEmail());
			if (newsUserList.size() > 0) {
				List<String> usernameList = new ArrayList<>();
				for (User userAux : newsUserList) {
					if (userAux.isApproved()) {
						System.out.println("!!!!!!!!!!!" + userAux.getUsername());
						usernameList.add(userAux.getUsername());
					}
				}
				System.out.println("huhahahahahaha");
				dto.setCoauthorList(usernameList);
			}
			dtoNews.add(dto);
		}

		return dtoNews;
	}

}
