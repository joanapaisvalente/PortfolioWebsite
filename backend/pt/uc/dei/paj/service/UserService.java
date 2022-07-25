package pt.uc.dei.paj.service;

import java.io.Serializable;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import pt.uc.dei.paj.dao.DAOUser;
import pt.uc.dei.paj.dto.DTOUser;
import pt.uc.dei.paj.entity.Type;
import pt.uc.dei.paj.entity.User;

@RequestScoped
public class UserService implements Serializable {

	private static final long serialVersionUID = 1L;

	// injects dao
	@Inject
	DAOUser userDao;

	public UserService() {
	}

	// método do controller user para poder fazer login
	public String loginUser(String username, String password) throws Exception {

		Object userobj = userDao.findByUserInfo(username, password);

		User user = (User) userobj;

		if (user == null) {

			return null;

		} else {

			if (user.getType() != null) {

				String tokenGenerated = createNewToken();

				// criar autorização header
				String authorizationHeader = "Basic " + tokenGenerated;

				user.setToken(authorizationHeader);
				userDao.merge(user);

				return authorizationHeader;
			}

			return "";
		}
	}

	// cria Token
	public String createNewToken() {

		SecureRandom secureRandom = new SecureRandom();
		Base64.Encoder base64Encoder = Base64.getUrlEncoder();

		byte[] randomBytes = new byte[24];
		secureRandom.nextBytes(randomBytes);

		return base64Encoder.encodeToString(randomBytes);
	}

	public void createAdmin(DTOUser userAux) throws Exception {
		User userEntity = userDao.convertDtoToEntity(userAux);
		userEntity.setApproved(true);
		userDao.persist(userEntity);
	}

	// método utilizado pelo user comum e pelo admin para poder registar novos
	// utilizadores
	public void createUser(DTOUser infoUser) throws Exception {
		User userEntity = userDao.convertDtoToEntity(infoUser);
		userDao.persist(userEntity);
	}

	// verifica se existe um utilizador na base de dados com aquele token
	public User validateToken(String token) throws Exception {

		User user = userDao.findUserByToken(token);
		return user;
	}

	// método do controller user para poder fazer logout
	public boolean logout(User user) throws Exception {

		user.setToken(null);
		userDao.merge(user);
		return true;
	}

	// método usado para encontrar o utilizador através do seu username
	public DTOUser findUser(String username) throws Exception {
		User user = userDao.find(username);

		if (user == null) {
			return null;

		} else {
			DTOUser dtoUser = userDao.convertEntityToDto(user);
			return dtoUser;
		}
	}
	
	public User findUserEntity(String username){
		
		try {
			return userDao.find(username);
		} catch(Exception e) {
			e.printStackTrace();
			return null;
		}
		
	}
	
	public User getUserByUsername(String username) throws Exception {
		return userDao.find(username);
	}

	// método para passar user a aprovado e a membro
	public boolean upgradeToMember(User user) throws Exception {

		if (user.isApproved()) {
			user.setApproved(false);
			user.setType(null);
			user.setToken(null);
			userDao.merge(user);
			return true;
		} else {

			user.setApproved(true);
			user.setType(Type.member);
			userDao.merge(user);
			return true;
		}
	}
	
	public boolean upgradeToAdmin(User user) throws Exception {
		
		if(user.getType().equals(Type.member)) {
			user.setType(Type.admin);
			userDao.merge(user);
			return true;
		} else if (user.getType().equals(Type.admin)){
			user.setType(Type.member);
			userDao.merge(user);
			return true;
		}
		
		return false;
	}
	
	public void deleteUser(User user) throws Exception {
		
		userDao.remove(user);
	}

	// método usado pelo admin para listar todos os utilizadores
	public List<DTOUser> listUsers() throws Exception {

		List<User> userListObj = userDao.listMembersAndAdmins();
		List<DTOUser> userList = new ArrayList<>();

		for (User u : userListObj) {

			DTOUser userDto = userDao.convertEntityToDto(u);
			userList.add(userDto);
		}
		return userList;
	}

	// método usado pelo admin para listar todos os admins
	public List<DTOUser> listAdmins() throws Exception {

		
		  List<User> adminListEntity = userDao.listAllAdmins();
		  List<DTOUser> adminListDto = new ArrayList<DTOUser>();
		  
		  for (User user : adminListEntity) {
		  
		  DTOUser dtoAdmin = userDao.convertEntityToDto(user);
		  adminListDto.add(dtoAdmin);
		  
		  } return adminListDto;
		
	}
	
	public void editProfile(DTOUser userDto, User user) throws Exception{
		
		User userEdited = userDao.convertDtoToEntity(user, userDto);
		userDao.merge(userEdited);
	}
	
	/*public List<DTOUser> findAvailableUsers () throws Exception{
		List<User> availableUsers = userDao.listAvailableUsers();
		
		System.out.println(availableUsers.size());
		List<DTOUser> userList = new ArrayList<>();

		for (User u : availableUsers) {

			DTOUser userDto = userDao.convertEntityToDto(u);
			userList.add(userDto);
		}
		return userList;
	}*/
	
	public List<DTOUser> findAvailableUsers (String username) throws Exception{
		List<User> availableUsers = userDao.listAvailableUsers(username);
		
		System.out.println(availableUsers.size());
		List<DTOUser> userList = new ArrayList<>();

		for (User u : availableUsers) {

			DTOUser userDto = userDao.convertEntityToDto(u);
			userList.add(userDto);
		}
		return userList;
	}

}
